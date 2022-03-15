## Shopgate Connect Shopware 6 User Extension by Apite

#### Development

You can set up the ENV variables when running `sgconnect` or use a local `.env` file.

##### For inline, the command will look like this:

```shell
SW_ENDPOINT=http://localhost SW_ACCESS_KEY=SWSCMMJTYLVIT1LBMJQWDLNSRG node $(which sgconnect) backend start
```

##### As an `.env` file.

In `[root]/extension` create an `.env` file with content like this:

```dotenv
SW_ENDPOINT: "http://localhost"
SW_ACCESS_KEY: "SWSCMMJTYLVIT1LBMJQWDLNSRG"
SW_LANG_ID: "2fbb5fe2e29a4d70aa5854ce7ce3e20b"
```

Run:

```shell
cd [root]/extension
node -r dotenv/config $(which sgconnect) backend start
```
