To set up locally:

- create empty app/controllers directory, or else something crashes
- `npm install`
- `gulp`
- localhost:3000 (proxied; cf browsersync) or localhost:4000 (config/config.js)

Client-side vendor dependencies are stuck under optionalDependencies in package.json... not because they're optional, just because Dylan wanted some way to differentiate. Hacky!

jQuery is brought in via a CDN; the draggable/droppable bits of jQuery UI are just in scripts/vendor/jquery-ui.js, & aren't vendor-bundled.
