## Shopgate Connect Shopware 6 User Extension by Apite, Managed By Shopgate

### Development

#### Setup

```shell
cd extension && npm i && cd ..
cd frontend && npm i && cd ..
```

#### Utility extension modification

If you need to add to the Utility extension, you will need to download it separately & install it locally:

```shell
cd ..
git clone git@github.com:shopgate/shopware6-utility.git
cd shopware6-user/extension
npm run utility:develop
```

#### Configurations

You can set up the ENV variables when running `sgconnect` or use a local `.env` file.

##### For inline, the command will look like this:

```shell
SW_ENDPOINT=http://localhost SW_ACCESS_KEY=SWSCMMJTYL... node $(which sgconnect) backend start
```

##### As an `.env` file.

In `[root]/extension` create an `.env` file with content like this:

```dotenv
SW_ENDPOINT: "http://localhost"
SW_ACCESS_KEY: "SWSCMMJTYL..."
SW_LANG_ID: "2fbb5fe2e2..."
```

Run:

```shell
cd [root]/extension
node -r dotenv/config $(which sgconnect) backend start
```

---
### Known Errors
* `No route found for "GET http://example.com/store-api/sgwebcheckout/login/token"` - SW6 Connect plugin is not
  enabled/installed
* `Cannot read property 'data' of undefined` - this error happens because Shopware 6 API client receives an error
  format it did not expect. This is a little tricky to work around!
