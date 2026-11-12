import test from 'node:test';
import assert from 'node:assert/strict';
import {actions,faculties,getState,demoProject,validateBackup,safeUrl,safeImage,readiness} from '../src/lib/store.ts';

test('faculty changes preserve independent project collections and shared profile',()=>{
 actions.start('architecture');actions.profile({name:'QA Student'});
 for(const f of faculties) actions.saveProject(demoProject(f));
 for(const f of faculties){actions.setFaculty(f.id);assert.equal(getState().projects.filter(p=>p.faculty===f.id).length,1);assert.equal(getState().profile.name,'QA Student');}
 const project=getState().projects[0];actions.saveProject({...project,title:'Edited'});assert.equal(getState().projects.length,8);assert.equal(getState().projects[0].title,'Edited');
 actions.deleteProject(project.id);assert.equal(getState().projects.length,7);
});
test('backup round-trip retains Korean content and rejects unknown formats',()=>{
 actions.profile({bio:'안녕하세요 — tarjima namunasi'});
 const backup=JSON.parse(JSON.stringify(getState()));assert.equal(validateBackup(backup).profile.bio,backup.profile.bio);
 assert.throws(()=>validateBackup({version:2}));assert.throws(()=>validateBackup({...backup,faculty:'missing'}));
});
test('import excludes executable URLs, SVGs and unknown dynamic fields',()=>{
 const b=JSON.parse(JSON.stringify(getState()));b.profile.photo='data:image/svg+xml,<svg onload=alert(1) />';b.projects[0].url='javascript:alert(1)';b.projects[0].fields.injected='bad';
 const validated=validateBackup(b);assert.equal(validated.profile.photo,'');assert.equal(validated.projects[0].url,'');assert.equal(validated.projects[0].fields.injected,undefined);
 assert.equal(safeUrl('javascript:alert(1)'),'');assert.equal(safeUrl('https://example.com'),'https://example.com/');assert.equal(safeImage('data:text/html;base64,AAAA'),'');
});
test('quota failure is visible and keeps the draft in memory',()=>{
 globalThis.window={};globalThis.localStorage={setItem(){throw new Error('quota');}};
 actions.profile({name:'Unsaved draft'});assert.equal(getState().profile.name,'Unsaved draft');assert.ok(getState().storageError);
 let stored='';globalThis.localStorage={setItem(k,v){stored=v;}};actions.profile({name:'Saved draft'});assert.equal(getState().storageError,'');assert.equal(JSON.parse(stored).profile.name,'Saved draft');
 delete globalThis.window;delete globalThis.localStorage;
});
test('readiness requires a real project contribution and valid contact',()=>{
 const p={...getState().profile,name:'A',headline:'Student',bio:'A sufficiently detailed description of my work.',email:'invalid',university:'University',skills:'Design'};
 const project={...demoProject(faculties[0]),role:''};const checks=readiness(p,[project]);assert.equal(checks.find(c=>c.label==='Aloqa ma’lumoti').done,false);assert.equal(checks.find(c=>c.label==='Loyihadagi hissangiz').done,false);
});
