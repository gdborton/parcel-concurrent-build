This is a repo meant to highlight two bugs that I found in Parcel.

The issues occur when you run multiple builds concurrently or even sequentially in the same process.

For the first issue, it seems that module resolution is only run once for both builds, which creates a problem if for example you're building a browser and server bundle.

The second issue is that parcel keeps the process open even after completing its work when building w/ two bundlers.

To run this repro.

```
npm install; node build.js
```

Notice the comment on line 33 of build.js, removing the server build makes the assertion pass.
Also notice the process.exit() call that is required to make the process end when both builds are complete.