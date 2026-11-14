-- Run only against a disposable/test database AFTER the migration, as postgres.
-- Uses fake auth users, tests authenticated and anonymous policies, then rolls back.
\set ON_ERROR_STOP on
begin;
create function pg_temp.expect_error(statement text, expected_state text) returns void language plpgsql as $$
begin
  begin
    execute statement;
  exception when others then
    if sqlstate <> expected_state then raise exception 'Expected %, received %: %', expected_state, sqlstate, sqlerrm; end if;
    return;
  end;
  raise exception 'Expected rejection for: %',statement;
end; $$;
insert into auth.users(id) values('11111111-1111-4111-8111-111111111111'),('22222222-2222-4222-8222-222222222222');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
insert into public.profiles(user_id,username) values(auth.uid(),'test-owner-a');
select pg_temp.expect_error($q$insert into public.profiles(user_id,username) values('22222222-2222-4222-8222-222222222222','forged-user')$q$,'42501');
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
select pg_temp.expect_error($q$insert into public.profiles(user_id,username) values(auth.uid(),'test-owner-a')$q$,'23505');
select pg_temp.expect_error($q$insert into public.profiles(user_id,username) values(auth.uid(),'admin')$q$,'23514');
insert into public.profiles(user_id,username) values(auth.uid(),'test-owner-b');
do $$ declare affected integer; begin
 update public.profiles set full_name='attacker' where username='test-owner-a';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Cross-owner UPDATE allowed';end if;
 delete from public.profiles where username='test-owner-a';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Cross-owner DELETE allowed';end if;
 update public.profiles set full_name='Owner B' where username='test-owner-b';get diagnostics affected=row_count;
 if affected<>1 then raise exception 'Own UPDATE denied';end if;
end; $$;
select pg_temp.expect_error($q$update public.profiles set username='new-identity' where username='test-owner-b'$q$,'P0001');
select pg_temp.expect_error($q$update public.profiles set user_id='11111111-1111-4111-8111-111111111111' where username='test-owner-b'$q$,'P0001');
insert into storage.objects(bucket_id,name) values('avatars','22222222-2222-4222-8222-222222222222/test.jpg');
insert into storage.objects(bucket_id,name) values('project-images','22222222-2222-4222-8222-222222222222/project.jpg');
select pg_temp.expect_error($q$insert into storage.objects(bucket_id,name) values('avatars','11111111-1111-4111-8111-111111111111/forged.jpg')$q$,'42501');
select pg_temp.expect_error($q$update storage.objects set name='11111111-1111-4111-8111-111111111111/moved.jpg' where name='22222222-2222-4222-8222-222222222222/test.jpg'$q$,'42501');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ declare affected integer; begin
 delete from storage.objects where name='22222222-2222-4222-8222-222222222222/test.jpg';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Cross-owner image DELETE allowed';end if;
 update storage.objects set name='11111111-1111-4111-8111-111111111111/stolen.jpg' where name='22222222-2222-4222-8222-222222222222/test.jpg';get diagnostics affected=row_count;
 if affected<>0 then raise exception 'Cross-owner image UPDATE allowed';end if;
end; $$;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
 if (select count(*) from public.profiles where username in ('test-owner-a','test-owner-b'))<>2 then raise exception 'Public SELECT denied';end if;
end; $$;
select pg_temp.expect_error($q$update public.profiles set full_name='anonymous' where username='test-owner-a'$q$,'42501');
select pg_temp.expect_error($q$insert into public.profiles(user_id,username) values('11111111-1111-4111-8111-111111111111','anonymous')$q$,'42501');
select pg_temp.expect_error($q$insert into storage.objects(bucket_id,name) values('avatars','anonymous/test.jpg')$q$,'42501');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ declare affected integer; begin
 delete from storage.objects where name='22222222-2222-4222-8222-222222222222/test.jpg';get diagnostics affected=row_count;
 if affected<>1 then raise exception 'Own image DELETE denied';end if;
 delete from public.profiles where username='test-owner-b';get diagnostics affected=row_count;
 if affected<>1 then raise exception 'Own profile DELETE denied';end if;
end; $$;
rollback;
\echo 'RLS tests passed; test data rolled back.'
