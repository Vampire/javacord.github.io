---
title: Welcome
position: 1
redirect_from: "/wiki/"
---
![](/img/javacord3_banner.png)

## Introduction

Welcome to the Javacord wiki! You can find all important topics on the right side.

## Download / Installation

The recommended way to get Javacord is to use a build manager, like Gradle or Maven.  
If you are not familiar with build managers, you can follow on of the setup guides
or download Javacord directly from [GitHub](https://github.com/Javacord/Javacord/releases/latest).

### Javacord Dependency

#### Gradle
```groovy
repositories { mavenCentral() }
dependencies { implementation 'org.javacord:javacord:${latest-version}' }
```

<p>
  <button class="btn btn-light btn-sm btn-block" type="button" data-toggle="collapse" data-target="#collapseGradleSnapshot" aria-expanded="false" aria-controls="collapseGradleSnapshot">
    Show Gradle snapshot dependency
  </button>
</p>
<div class="collapse" id="collapseGradleSnapshot">
<p>
Snapshots are automatically deployed from the <a href="https://github.com/Javacord/Javacord/tree/development" target="_blank"><code class="highlighter-rouge">development</code></a> branch.
</p>
{% highlight groovy %}
repositories { 
  maven {
    url "https://oss.sonatype.org/content/repositories/snapshots/"
  }
}
dependencies { 
  implementation 'org.javacord:javacord:${latest-snapshot-version}' 
}
{% endhighlight %}

</div>


#### Maven
```xml
<dependency>
    <groupId>org.javacord</groupId>
    <artifactId>javacord</artifactId>
    <version>${latest-version}</version>
    <type>pom</type>
</dependency>
```

<p>
  <button class="btn btn-light btn-sm btn-block" type="button" data-toggle="collapse" data-target="#collapseMavenSnapshot" aria-expanded="false" aria-controls="collapseMavenSnapshot">
    Show Maven snapshot dependency
  </button>
</p>
<div class="collapse" id="collapseMavenSnapshot">
<p>
Snapshots are automatically deployed from the <a href="https://github.com/Javacord/Javacord/tree/development" target="_blank"><code class="highlighter-rouge">development</code></a> branch.
</p>
{% highlight xml %}
<repository>
    <id>snapshots-repo</id>
    <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
</repository>
{% endhighlight %}
{% highlight xml %}
<dependency>
    <groupId>org.javacord</groupId>
    <artifactId>javacord</artifactId>
    <version>${latest-snapshot-version}</version>
    <type>pom</type>
</dependency>
{% endhighlight %}

</div>

### Optional Logger Dependency

Any Log4j-2-compatible logging framework can be used to provide a more sophisticated logging experience
with being able to configure log format, log targets (console, file, database, Discord direct message, ...),
log levels per class, and much more.

For example, Log4j Core in Gradle
```groovy
dependencies { runtimeOnly 'org.apache.logging.log4j:log4j-core:2.11.0' }
```
Take a look at the [Logger Configuration](/wiki/basic-tutorials/logger-configuration/) wiki article for further information.

## IDE Setup

If you've never used Gradle or Maven before, you should take a look at the setup tutorial:
* **[IntelliJ & Gradle](/wiki/getting-started/intellij-gradle)** _(recommended)_
* **[IntelliJ & Maven](/wiki/getting-started/intellij-maven)**
* **[Eclipse & Maven](/wiki/getting-started/eclipse-maven)**

## Support

Javacord's Discord community is an excellent resource if you have questions about the library.  
* **[The Javacord Server](https://discord.gg/0qJ2jjyneLEgG7y3)**

## Examples

There's an example bot written with Javacord: [Javacord Example Bot](https://github.com/Javacord/JavacordExampleBot)
