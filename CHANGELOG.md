Changelog
=========
1.6.4
------------------
- List webhook notification filters updated

1.6.3
-------------------
- Update paypal account method added
- Bank account status transition changed from DE-ACTIVATED to DE_ACTIVATED

1.6.2
-------------------
- Added custom headers 
- Added Transfer status transitions (get, list)
- Added Paypal accounts status transitions
- Added filters
- Added listTransferMethods

1.5.0
-------------------
- Added Venmo accounts
- Added Multipart upload documents feature for User
- Added Transfer refunds
- Added User status transitions (activate, deactivate, preactivate, freeze, lock)

1.4.1
-------------------
- Add Venmo Accounts endpoints
- Add Transfer Refunds endpoint
- Add Multipart Form data upload to User 

1.4.0
-------------------
- Add PayPal account status transitions
- Remove VersionEye from Node

1.3.1 (2019-04-09)
-------------------
- FIX: TypeError thrown when response status is 204 No Content

1.3.0 (2019-01-25)
-------------------
- Added field "VerificationStatus" to User
- Client-token endpoint renamed to authentication-token

1.0.1 (2019-01-22)
-------------------
- FIX: Resolved issue with restricted "Accept" & "Content-Type" headers to support only "application/json" or "application/jose+json"

1.0.0  (2018-12-21)
-------------------
- Added PayPal account endpoint
- Added transfer endpoint
- Added client token endpoint
- Added Layer 7 encryption
- Added payment status transition endpoint
- Added paper check endpoint
- Added bank card endpoint
- Added list program account receipt endpoint
- Added list user receipt endpoint
- Added list prepaid card receipt endpoint
- Added list program account balance endpoint
- Changed default server from https://sandbox.hyperwallet.com to https://api.sandbox.hyperwallet.com

0.1.1 (2016-06-30)
------------------

- Fixed package.json reference issue

0.1.0 (2016-06-30)
------------------

- Initial release
