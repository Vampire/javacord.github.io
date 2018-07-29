---
title: Logger configuration
position: 4
keywords:
- log4j2
- sdcf4j
- logback
---

Logging is an important tool to keep track of what's going on in your application. Javacord uses the [slf4j](https://www.slf4j.org), which allows you to use your favorite logging framework. In case you don't add your own logging framework, a fallback logger is used.

## Fallback Logger Configuration

Javacord's fallback logger is a very simple slf4j implementation which always logs `INFO` level and higher. It allows you to enable `DEBUG` and `TRACE` logging manually:
```java
// Enable debug logging
FallbackLoggerConfiguration.setDebug(true);

// Enable trace logging
FallbackLoggerConfiguration.setTrace(true);
```
All messages are printed to the standard output stream (`System.out`) or the standard error output stream (`System.err`) respectively.

## Using SLF4J

### Adding a Logging Framework

Adding a logging framework of your choice is very straightforward. You can just add it as a dependency and it will be detected by slf4j automatically. This following example adds logback-classic using Maven:
```xml
<dependency>
  <groupId>ch.qos.logback</groupId>
  <artifactId>logback-classic</artifactId>
  <version>1.2.3</version>
</dependency>
```

### Configure Your Logging Framework

* **Logback-Classic**: [Logback configuration](https://logback.qos.ch/manual/configuration.html)
* **Log4j 2**: [Log4j configuration](https://logging.apache.org/log4j/2.x/manual/configuration.html)