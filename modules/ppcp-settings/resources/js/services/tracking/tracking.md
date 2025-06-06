# Tracking System Architecture

## Overview

The tracking system provides comprehensive analytics for user interactions across onboarding, settings, and other flows. It features source-based field filtering, multi-funnel support, and extensible adapter architecture to prevent tracking loops and enable granular event control.
It monitors WordPress data stores rather than adding code to frontend components, ensuring comprehensive coverage of all state changes regardless of their source (user actions, API responses, system updates) while maintaining clean separation of concerns.

## Architecture Components

### File/Folder Organization

```
src/
├── services/
│   └── tracking/
│       ├── registry.js                    # Central funnel registration
│       ├── subscription-manager.js        # Store subscription management
│       ├── utils.js                      # Field config helpers & utilities
│       ├── adapters/                     # Tracking destination adapters
│       │   ├── woocommerce-tracks.js     # WooCommerce Tracks integration
│       │   └── console-logger.js         # Console output
│       └── funnels/                      # Funnel-specific configurations
│           └── onboarding.js             # Onboarding funnel config & translations
├── data/                                 # Enhanced Redux stores
│   ├── onboarding/
│   │   ├── actions.js                    # Enhanced with source parameter
│   │   ├── reducer.js                    # Enhanced with field source tracking
│   │   └── hooks.js                      # Enhanced to pass source values
│   └── common/
│       ├── actions.js                    # Enhanced with source parameter
│       ├── reducer.js                    # Enhanced with field source tracking
│       └── hooks.js                      # Enhanced to pass source values
└── components/                           # Enhanced to pass tracking sources
    └── **/*.js                          # Form components updated with source attribution
```

### 1. Registry System (`src/services/tracking/registry.js`)

The registry manages funnel registration and coordinates multiple tracking concerns without conflicts.

#### Key Features
- Registers tracking funnels with their configurations
- Maps stores to funnels to prevent duplicate subscriptions
- Provides centralized funnel validation and status monitoring
- Enables dynamic funnel activation based on conditions

#### Usage
```javascript
import { registerTrackingFunnel } from '../services/tracking/registry';

registerTrackingFunnel('onboarding', {
    stores: ['wc/paypal/onboarding', 'wc/paypal/common'],
    trackingCondition: {
        store: 'wc/paypal/common',
        selector: 'merchant',
        field: 'isConnected',
        expectedValue: false
    },
    fieldConfigs: {
        'wc/paypal/onboarding': [
            createFieldTrackingConfig('step', 'persistent', {
                rules: { allowedSources: ['user', 'system'] }
            })
        ]
    },
    debug: false
});
```

### 2. Subscription Manager (`src/services/tracking/subscription-manager.js`)

Creates unified subscriptions to WordPress data stores and routes changes to relevant funnels.

#### Key Features
- Prevents subscription conflicts when multiple funnels track the same store
- Routes store changes to relevant funnels based on configurations
- Manages funnel lifecycle (activation/deactivation based on conditions)
- Provides atomic state snapshots for consistent condition evaluation

#### How It Works
```javascript
// Single subscription handles multiple funnels
const subscription = wp.data.subscribe(() => {
    const registrations = this.storeRegistrations[storeName] || [];
    registrations.forEach(registration => {
        this.processFunnelForStore(storeName, registration, select, store);
    });
});
```

### 3. Source-Based Field Filtering (`src/services/tracking/utils.js`, `subscription-manager.js`)

**Why Source Tracking?** Redux store subscriptions and internal system updates were creating noise in analytics by triggering tracking events for non-user actions.

#### Implementation
Field-level source rules define which change sources should trigger tracking events.

```javascript
// Field rules configuration
fieldRules: {
    step: { allowedSources: ['user', 'system'] },          // Track all changes
    isCasualSeller: { allowedSources: ['user'] },          // Only user changes
    products: { allowedSources: ['user', 'system'] }       // Track all changes
}

// Usage in components
const { setIsCasualSeller } = useOnboardingHooks();
setIsCasualSeller(true, 'user'); // Will be tracked
setIsCasualSeller(false); // Will be filtered out
```

#### Source Types
- `'user'` - Direct user interactions (form inputs, button clicks)
- `'system'` - System-initiated changes (data loaded from settings, defaults)

### 4. Adapter Pattern (`src/services/tracking/adapters/`)

Supports multiple tracking backends through a consistent interface.

#### Available Adapters

##### WooCommerce Tracks Adapter (`src/services/tracking/adapters/woocommerce-tracks.js`)
```javascript
class WooCommerceTracksAdapter {
    sendEvent(eventName, properties) {
        if (window.wcTracks?.recordEvent) {
            window.wcTracks.recordEvent(eventName, properties);
        }
    }
}
```

##### Console Logger Adapter (`src/services/tracking/adapters/console-logger.js`)
```javascript
class ConsoleLoggerAdapter {
    sendEvent(eventName, properties) {
        console.log(`🎯 ${eventName}`, properties);
    }
}
```

#### Creating Custom Adapters
```javascript
// src/services/tracking/adapters/your-custom-adapter.js
class CustomAnalyticsAdapter {
    sendEvent(eventName, properties) {
        // Your custom implementation
        customAnalytics.track(eventName, properties);
    }
}

// Register in funnel configuration
trackingService.addAdapter(new CustomAnalyticsAdapter());
```

### 5. Funnel Configurations & Translation Functions (`src/services/tracking/funnels/`)

Each funnel gets its own file containing both configuration and translation functions.

#### Example: Onboarding Funnel (`src/services/tracking/funnels/onboarding.js`)
```javascript
import { createFieldTrackingConfig, createBooleanFieldConfig } from '../utils';

// Translation functions for this funnel
export const translations = {
    isCasualSeller: (oldValue, newValue, metadata, trackingService) => {
        const accountType = newValue === true ? 'personal' : 'business';
        
        const eventData = {
            account_type: accountType,
            step: metadata.step || 'unknown',
            products: metadata.products || [],
            timestamp: Date.now()
        };

        trackingService.sendToAdapters('ppcp_onboarding_account_type_select', eventData);
    },

    step: (oldValue, newValue, metadata, trackingService) => {
        if (newValue > oldValue) {
            const eventData = {
                from_step: oldValue,
                to_step: newValue,
                account_type: metadata.isCasualSeller ? 'personal' : 'business'
            };

            trackingService.sendToAdapters('ppcp_onboarding_step_forward', eventData);
        }
    }
};

// Funnel configuration
export const onboardingFunnelConfig = {
    funnelId: 'onboarding',
    stores: ['wc/paypal/onboarding', 'wc/paypal/common'],
    
    trackingCondition: {
        store: 'wc/paypal/common',
        selector: 'merchant', 
        field: 'isConnected',
        expectedValue: false
    },
    
    fieldConfigs: {
        'wc/paypal/onboarding': [
            createFieldTrackingConfig('step', 'persistent', {
                rules: { allowedSources: ['user', 'system'] }
            }),
            createBooleanFieldConfig('isCasualSeller', 'persistent', ['user'])
        ]
    },
    
    translations,
    debug: process.env.NODE_ENV === 'development'
};
```

## Configuration

### Field Configuration Helpers

The system provides helper functions to reduce boilerplate when configuring field tracking.

```javascript
import { 
    createFieldTrackingConfig,
    createBooleanFieldConfig,
    createArrayFieldConfig,
    createNestedFieldConfig
} from '../services/tracking/utils';

// Basic field configuration
createFieldTrackingConfig('step', 'persistent', {
    rules: { allowedSources: ['user', 'system'] }
});

// Boolean field with user-only tracking
createBooleanFieldConfig('isCasualSeller', 'persistent', ['user']);

// Array field tracking
createArrayFieldConfig('products', 'persistent', ['user', 'system']);

// Nested field tracking
createNestedFieldConfig('merchant', 'persistent', 'isConnected', ['system']);
```

### Funnel Configuration

Complete funnel configuration example:

```javascript
const onboardingFunnelConfig = {
    funnelId: 'onboarding',
    stores: ['wc/paypal/onboarding', 'wc/paypal/common'],
    
    // Only track when merchant is not connected
    trackingCondition: {
        store: 'wc/paypal/common',
        selector: 'merchant',
        field: 'isConnected',
        expectedValue: false
    },
    
    // Field configurations per store
    fieldConfigs: {
        'wc/paypal/onboarding': [
            createFieldTrackingConfig('step', 'persistent', {
                rules: { allowedSources: ['user', 'system'] }
            }),
            createBooleanFieldConfig('isCasualSeller', 'persistent', ['user']),
            createArrayFieldConfig('products', 'persistent', ['user', 'system'])
        ],
        'wc/paypal/common': [
            createNestedFieldConfig('merchant', 'persistent', 'isConnected', ['system'])
        ]
    },
    
    // Translation functions
    translations,
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development'
};
```

## Integration with Redux Stores

### Action Enhancement (`src/data/{store}/actions.js`)

Store actions for tracked fields have been enhanced to support source tracking. **Note:** Source tracking support must be manually added to specific actions when you want to track new fields or extend tracking to additional data stores.

```javascript
// src/data/onboarding/actions.js

// Before
export const setIsCasualSeller = (isCasualSeller) =>
    setPersistent('isCasualSeller', isCasualSeller);

// After  
export const setIsCasualSeller = (isCasualSeller, source = 'user') =>
    setPersistent('isCasualSeller', isCasualSeller, source);
```

#### Adding Source Support to New Fields

To add source tracking to additional fields, you need to:

1. **Update the action creator** (`src/data/{store}/actions.js`) to accept and pass the source parameter:
```javascript
// Add source parameter to action creator
export const setNewField = (value, source = 'user') =>
    setPersistent('newField', value, source);
```

2. **Update the hook** (`src/data/{store}/hooks.js`) to pass source values:
```javascript
// In hooks file
const setNewField = async (value, source = 'user') => {
    setNewFieldAction(value, source);
    await dispatchActions.persist();
};
```

3. **Add field configuration** to your funnel (`src/services/tracking/funnels/{funnel-name}.js`):
```javascript
fieldConfigs: {
    'your-store-name': [
        createFieldTrackingConfig('newField', 'persistent', {
            rules: { allowedSources: ['user'] }
        })
    ]
}
```

#### Adding Source Support to New Data Stores

To extend tracking to a new data store:

1. **Enhance the base actions** (`src/data/{new-store}/actions.js`) - add `setPersistent`/`setTransient` to handle source:
```javascript
// In your new store's actions.js
export const setPersistent = (prop, value, source) => ({
    type: ACTION_TYPES.SET_PERSISTENT,
    payload: { [prop]: value },
    source,
    fieldName: prop,
});
```

2. **Update the reducer** (`src/data/{new-store}/reducer.js`) to track field sources:
```javascript
// In your reducer
case ACTION_TYPES.SET_PERSISTENT:
    const fieldName = action.fieldName;
    let newState = changePersistent(state, action);
    
    // Add field source tracking
    if (action?.source && fieldName) {
        newState.fieldSources = updateFieldSources(
            newState.fieldSources,
            fieldName,
            action.source
        );
    }
    
    return newState;
```

3. **Create enhanced hooks** (`src/data/{new-store}/hooks.js`) that pass source values:
```javascript
export const useNewStoreHooks = () => {
    return {
        setNewField: async (value, source = 'user') => {
            setNewFieldAction(value, source);
            await dispatchActions.persist();
        }
    };
};
```

4. **Register the store** in your funnel configuration (`src/services/tracking/funnels/{funnel-name}.js`):
```javascript
registerTrackingFunnel('your-funnel', {
    stores: ['your-new-store-name'],
    // ... rest of configuration
});
```

### Reducer Enhancement (`src/data/{onboarding,common}/reducer.js`)

Reducers automatically handle field source tracking (only for onboarding and common data stores for now):

```javascript
case ACTION_TYPES.SET_PERSISTENT:
    const fieldName = action.fieldName;
    let newState = changePersistent(state, action);
    
    // Track field source if provided
    if (action?.source && fieldName) {
        newState.fieldSources = updateFieldSources(
            newState.fieldSources,
            fieldName,
            action.source
        );
    }
    
    return newState;
```

### Hook Integration (`src/data/{onboarding,common}/hooks.js`)

Custom hooks pass appropriate source values (only for onboarding and common data stores for now):

```javascript
// src/data/onboarding/hooks.js
export const useOnboardingHooks = () => {
    const { setIsCasualSeller: setIsCasualSellerAction } = useActions();
    
    return {
        setIsCasualSeller: async (value, source = 'user') => {
            setIsCasualSellerAction(value, source);
            await dispatchActions.persist();
        }
    };
};
```

### Component Integration (`src/components/**/*.js`)

Update form components and user interaction handlers to pass appropriate source values:

```javascript
// src/components/onboarding/AccountTypeSelector.js
import { useOnboardingHooks } from '../../data/onboarding/hooks';

const AccountTypeSelector = () => {
    const { setIsCasualSeller } = useOnboardingHooks();
    
    const handleAccountTypeChange = (accountType) => {
        const isCasual = accountType === 'personal';
        setIsCasualSeller(isCasual, 'user'); // Specify 'user' source for tracking
    };
    
    return (
        <select onChange={(e) => handleAccountTypeChange(e.target.value)}>
            <option value="business">Business</option>
            <option value="personal">Personal</option>
        </select>
    );
};
```


## Event Schema

### Event Naming Convention

Events follow the pattern: `ppcp_{funnel}_{action}_{object}`

Examples:
- `ppcp_onboarding_account_type_select`
- `ppcp_onboarding_step_forward`
- `ppcp_onboarding_product_add`
- `ppcp_settings_payment_method_toggle`

## Testing and Debugging

### Enable Debug Mode

Set debug mode in funnel configuration:

```javascript
registerTrackingFunnel('onboarding', {
    // ... other config
    debug: true
});
```

### WooCommerce Tracks Debug

Enable WooCommerce Tracks debugging in browser console:

```javascript
localStorage.setItem('debug', 'wc-admin:*');
```
