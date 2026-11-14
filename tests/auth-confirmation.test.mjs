import test from "node:test";
import assert from "node:assert/strict";
import { confirmSignIn } from "../lib/auth-confirmation.ts";

function fixture(result = { error: null }) {
  const calls = [];
  return {
    calls,
    auth: {
      exchangeCodeForSession: async (code) => { calls.push(["code", code]); return result; },
      verifyOtp: async (input) => { calls.push(["hash", input]); return result; },
    },
  };
}

test("default email template code is exchanged for a session", async () => {
  const {auth,calls} = fixture();
  assert.equal(await confirmSignIn(new URLSearchParams("code=email-code"),auth),true);
  assert.deepEqual(calls,[["code","email-code"]]);
});

test("custom email template remains supported and cannot change the token type", async () => {
  const {auth,calls} = fixture();
  assert.equal(await confirmSignIn(new URLSearchParams("token_hash=email-hash&type=recovery"),auth),true);
  assert.deepEqual(calls,[["hash",{token_hash:"email-hash",type:"email"}]]);
});

test("missing credentials and provider errors do not start an exchange", async () => {
  const {auth,calls} = fixture();
  for(const query of ["","code=","token_hash=","error=access_denied&code=invalid"]) {
    assert.equal(await confirmSignIn(new URLSearchParams(query),auth),false);
  }
  assert.deepEqual(calls,[]);
});

test("rejected or consumed code does not fall back to a second credential", async () => {
  const {auth,calls} = fixture({error:{message:"Code expired"}});
  assert.equal(await confirmSignIn(new URLSearchParams("code=expired&token_hash=another"),auth),false);
  assert.deepEqual(calls,[["code","expired"]]);
});

test("rejected token hash does not authenticate", async () => {
  const {auth} = fixture({error:{message:"Token expired"}});
  assert.equal(await confirmSignIn(new URLSearchParams("token_hash=expired"),auth),false);
});

test("network failure returns a failed sign-in without exposing an exception", async () => {
  const auth={exchangeCodeForSession:async()=>{throw Error("Network unavailable");},verifyOtp:async()=>{throw Error("Network unavailable");}};
  for(const query of ["code=example","token_hash=example"])assert.equal(await confirmSignIn(new URLSearchParams(query),auth),false);
});
