# package-firewall

An experimental package network access control tool

# It's an experiment. Do not rely on it. Not fit to run in production.

Now with all the disclaimers done, let's get into it.

## idea

package-firewall reviews all stack traces leading to requiring a `net` module in your entire codebase (including dependencies) in runtime. `net` is the internal module that's behind all socket/http etc. communication in Node.js. It only lets the ones you allowed through. 

It means whenever you (or a malicious package) require anything that could make an outbound request, it must be verified.

The aim is for it to be simple to use, so you record a running application and review results. All configuration is generated for you to edit/tweak.

I'll remove the disclaimer once there's a reason to believe it really works well enough.

## usage

### prepare

```
npm install package-firewall
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
