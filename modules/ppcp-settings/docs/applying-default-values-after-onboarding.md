# Applying Default Configuration After Onboarding

The `OnboardingProfile` has a property named `setup_done`, which indicated whether the default
configuration was set up.

### `OnboardingProfile::is_setup_done()`

This flag indicated, whether the default plugin configuration was applied or not.
It's set to true after the merchant's authentication attempt was successful, and settings were
adjusted.

The only way to reset this flag, is to enable the "**Start Over**" toggle and disconnecting the
merchant:
https://example.com/wp-admin/admin.php?page=wc-settings&tab=checkout&section=ppcp-gateway&panel=settings#disconnect-merchant

### `class SettingsDataManager`

The `SettingsDataManager` service is responsible for applying all defaults options at the end of the
onboarding process.

### `SettingsDataManager::set_defaults_for_new_merchant()`

This method expects a DTO argument (`ConfigurationFlagsDTO`) that provides relevant details about
the merchant and onboarding choices.

It verifies, if default settings were already applied (by checking the
`OnboardingProfile::is_setup_done()` state). If not done yet, the DTO object is inspected to
initialize the plugin's configuration, before marking the `setup_done` flag as completed.

## Default Settings Matrix

### Payment Methods



### Settings

| Feature                     | Country | Seller-Type | Subscriptions | Cards | 
|-----------------------------|---------|-------------|---------------|-------|
| Pay Now Experience          | US      | _any_       | _any_         | _any_ |
| Save PayPal and Venmo       | US      | Business    | ✅             | _any_ |
| Save Credit and Debit Cards | US      | Business    | ✅             | ✅     |

### Styling

All US merchants use the same settings, regardless of any onboarding choices.

| Button Location  | Enabled | Displayed Payment Methods                       |
|------------------|---------|-------------------------------------------------|
| Cart             | ✅       | PayPal, Venmo, Pay Later, Google Pay, Apple Pay |
| Classic Checkout | ✅       | PayPal, Venmo, Pay Later, Google Pay, Apple Pay |
| Express Checkout | ✅       | PayPal, Venmo, Pay Later, Google Pay, Apple Pay |
| Mini Cart        | ✅       | PayPal, Venmo, Pay Later, Google Pay, Apple Pay |
| Product Page     | ✅       | PayPal, Venmo, Pay Later                        |
