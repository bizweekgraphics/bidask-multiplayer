To set up locally:

- create empty app/controllers directory, or else something crashes
- `npm install`
- `gulp`
- localhost:3000 (proxied; cf browsersync) or localhost:4000 (config/config.js)

Client-side vendor dependencies are stuck under optionalDependencies... not because they're optional, just because Dylan wanted some way to differentiate. Hacky!
