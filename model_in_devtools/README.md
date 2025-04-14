# MyMiniMusicMosaicModel

TL;DR;
This is a playable version of the game requiring nothing but a webserver on localhost, it does nothing else.
It has been written just to test the game logic.
That is **this folder along with its content will be deleted, and has nothing to do with the webapp that is being deployed**.

Quoting from the course material...

> The Model keeps the state of the application (Application State). 
> It is an abstract object, i.e. it knows nothing about graphics and interaction.

...and this is exactly what this model does, with some extra convenience functions.
To test, just get in the very directory of this `README.md`, then

```
$ npm install -g http-server
$ http-server -p 8088
```

hence point your browser at http://localhost:8088.

Luca was here.
