---
title: Thread Safety
position: 4
---

As Javacord is heavily multithreaded, you should know how to write thread-safe applications. I recommend the following online tutorial if you are not familiar with multithreading yet: [Java Concurrency / Multithreading Tutorial](http://tutorials.jenkov.com/java-concurrency/index.html). The goal of this wiki article is not to teach you how to write thread-safe code in general, but to tell you everything Javacord-specific you need to know in order to do so.

## Listener threads

Javacord's listeners may run in different threads in order to increase performance and decrease the impact of blocking operations or heavy computations in a listener thread. There are some guarantees, however. In order to ensure the correct order of events:
* Server specific events (e.g. a message being sent in a `ServerTextChannel`) are executed sequentially. A new event for the same server only gets dispatched, if the previous event was handled by all listeners.
* Server and connection independent events (e.g. a message being sent in a `PrivateChannel`) are executed sequentially.
* Connection specific events (e.g. the `LostConnectionEvent`) always wait for **all** events that happened before the connection event.
> **Important**: Even though "related" events are executed sequentially, it's not guaranteed that they are executed by the same thread. This means that you have to take care with thread visibility, e.g. by using the `volatile` keyword, if your listeners aren't stateless.

## Mutability

### Returned collections

Every collection returned by Javacord (e.g. `Server#getMembers()`) is guaranteed to be immutable.

> **Note**: Even though the collection itself is immutable, its elements might not!

### Objects

Most objects in Javacord are mutable, which means their content can change anytime.
```java
System.out.println(server.getMembers().size()); // prints 10
System.out.println(server.getMembers().size()); // prints 11 (a user joined)
```

## Thread Safety

### Builder/Updater classes

Builder/Updater classes (e.g. the `ServerTextChannelUpdater`) are **not** thread-safe.