# package-firewall

An experimental package network access control tool


## usage

### prepare

```
npm i -D package-firewall
```

```
node --require package-firewall/record app.js
```

Produces a list of signatures in `package.json` and creates a `packageFirewallSignatureReference.json` file for you to look up the stack traces leading through your program to the place where `net` module got required.

You need to review those and check if you recognize the modules there.   
Keep the signatures for modules (and code paths) you want to have network access. 

If you don't like what you see, investigate the packages, obviously.

### run
Run your app like this:

```
node --require package-firewall app.js
```

And the app will **crash** whenever a new code path tries to use network.

#### warn mode

Crashing the app is too much? You can run it as a warning too.

```
node --require package-firewall/warn app.js
```
