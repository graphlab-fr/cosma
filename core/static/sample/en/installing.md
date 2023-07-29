---
title: Installing
id: 20210901132906
type: documentation
---

[[20210901131627]] Cosma is available in two versions: a graphical user interface (GUI) application and a command line interface (CLI) application.

## GUI version

The GUI version of Cosma is available for macOS and Windows. Visit the Releases page of the GitHub repository to get [the latest version](https://github.com/graphlab-fr/cosma/releases/latest). Please note that the application is not signed with a security certificate, so you must have administrator privileges on your session to run it.

On macOS: download and unzip `Cosma.app.zip`, then place it in `~/Applications`. For the first launch, right click on the application then select Open to run it.

On Windows: download and unzip `Cosma-win32-x64.zip`, then rename the folder `Cosma` and place it in `C:\Program Files` or `C:\Program Files (86)`.

## CLI version

The CLI version of Cosma is available on macOS, Windows and Linux. The installation of [NodeJS](https://nodejs.org/) version 15 or higher is required. Enter the following command in your terminal to install Cosma CLI:

```
npm i @graphlab-fr/cosma -g
```
