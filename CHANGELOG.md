# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres
to [Semantic Versioning](http://semver.org/).

## 2.0.0

- updated utility to version 2.0.0

## 1.3.1

- updated utility version to fix config related logging

## 1.3.0

- added support to SW6.6 contextToken loaded from response header

## 1.2.1

- added IT, FR, ES translations

## 1.2.0

- added token sync via pipelines
- changed token sync via hooks to avoid race conditions

## 1.1.2

- updated utility dependency to suppress error from getRegistrationUrl/getCart due to race condition

## 1.1.1

- added logging when getting the registration URL
- fixed URL concatenation logic to accommodate folders within an endpoint

## 1.1.0

- changed slug from `sgconnect` to `sgwebcheckout`

## 1.0.0

- changed alpha versioning to release

## 0.1.0-beta.2

- fixed issue with guest tokens mixing with logged in customer tokens
- removed service classes (moved to separate module)
- removed locales (moved to separate module)

## 0.1.0-beta.1

- added initial plugin release for beta testing
