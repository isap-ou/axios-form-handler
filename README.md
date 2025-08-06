# axios-form-handler

A form handling library inspired by Inertia.js `useForm`, with Axios integration for seamless API requests and Laravel validation support.

## Features

- 🚀 **Inertia.js-like API**: Familiar `useForm` interface for developers coming from Inertia.js
- 🔧 **TypeScript Support**: Full TypeScript support with type definitions
- 🌐 **Axios Integration**: Built-in HTTP client integration
- ✅ **Laravel Validation**: Automatic Laravel validation error handling (422 responses)
- 🔄 **State Management**: Built-in form state management (processing, errors, fields)
- 📦 **Framework Agnostic**: Works with React, Vue, Alpine.js, or vanilla JS/TS
- 🎯 **Lightweight**: Minimal dependencies, maximum functionality

## Installation

```bash
npm install axios-form-handler
```

```bash
yarn add axios-form-handler
```

```bash
pnpm add axios-form-handler
```

## Why axios-form-handler?

If you love the simplicity of Inertia.js `useForm` but need to use it with traditional APIs or in non-Inertia applications, this library is for you! It provides the same intuitive form handling experience with:

- **Laravel-ready**: Automatically handles Laravel validation responses (422 status codes)
- **Familiar API**: Same method names and behavior as Inertia.js `useForm`
- **Universal compatibility**: Works in any JavaScript/TypeScript environment
- **Axios powered**: Leverages the popular Axios HTTP client

Perfect for developers building SPAs or Alpine.js  with Laravel backends, migrating from Inertia.js, or anyone who wants Laravel-style form validation in their frontend applications.

## Quick Start

```typescript
import { useForm } from 'axios-form-handler';

// Create a form instance (just like Inertia.js!)
const form = useForm({
  name: '',
  email: '',
  message: ''
});

// Submit the form to your Laravel API
form.post('/api/contact', {
  onSuccess: (data) => {
    console.log('Form submitted successfully:', data);
  },
  onValidationErrors: (errors) => {
    // Laravel validation errors automatically parsed
    console.log('Validation errors:', errors);
  },
  onError: (error) => {
    console.log('Request failed:', error);
  }
});
```

## Laravel Backend Integration

This library is designed to work seamlessly with Laravel's validation system:

```php
// Laravel Controller
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string'
    ]);
    
    // Your logic here...
    
    return response()->json(['message' => 'Success!']);
}
```

When validation fails, Laravel returns a 422 status code with errors in this format:
```json
{
    "errors": {
        "email": ["The email field is required."],
        "name": ["The name field is required."]
    }
}
```

The library automatically catches these errors and populates the `form.errors` object!

## API Reference

### `useForm(fields)`

Creates a new form instance with the specified fields.

**Parameters:**
- `fields` (Record<string, any>): Initial form field values

**Returns:** FormInstance

### Form Methods

#### `post(route, options?)`
Submit form data via POST request.

#### `put(route, options?)`
Submit form data via PUT request.

#### `patch(route, options?)`
Submit form data via PATCH request.

#### `delete(route, options?)`
Submit form data via DELETE request.

#### `reset()`
Reset form to initial values and clear errors.

#### `clearErrors()`
Clear all validation errors.

#### `setError(key, message)`
Set validation error for a specific field.

### Response Options

```typescript
interface ResponseOption {
  onSuccess?: (data: Record<any, any>) => void;
  onValidationErrors?: (data: Record<any, any>) => void;
  onError?: (error: AxiosError) => void;
  onFinish?: () => void;
}
```

### Form Properties

- `fields`: Access to all form field values
- `errors`: Current validation errors
- `processing`: Boolean indicating if request is in progress
- `hasErrors`: Boolean indicating if form has validation errors

## Advanced Usage

### Custom Axios Instance

```typescript
import axios from 'axios';
import { setFormAxios } from 'axios-form-handler';

// Create custom axios instance
const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer your-token'
  }
});

// Set as default for all forms
setFormAxios(api);
```

### Working with Form Fields

```typescript
const form = useForm({
  username: 'john_doe',
  email: 'john@example.com'
});

// Access field values
console.log(form.username); // 'john_doe'
console.log(form.fields); // { username: 'john_doe', email: 'john@example.com' }

// Update field values
form.username = 'jane_doe';
form.email = 'jane@example.com';

// Check for errors
if (form.hasErrors) {
  console.log(form.errors);
}
```

### Laravel Validation Error Handling

The library automatically handles Laravel-style validation errors (422 status code) exactly like Inertia.js:

```typescript
const form = useForm({ 
  email: '', 
  password: '' 
});

form.post('/api/login', {
  onValidationErrors: (errors) => {
    // Laravel validation errors are automatically parsed
    console.log(errors.email);    // "The email field is required"
    console.log(errors.password); // "The password field is required"
  }
});

// Access errors directly on the form object
if (form.hasErrors) {
  console.log(form.errors.email); // Direct access to field errors
}
```

**Laravel Response Format (422 status):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Parsed Form Errors:**
```javascript
form.errors = {
  email: "The email field is required.",
  password: "The password must be at least 8 characters."
}
```

### Loading States

```typescript
const form = useForm({ name: '', email: '' });

form.post('/api/contact', {
  onFinish: () => {
    // This runs whether the request succeeds or fails
    console.log('Request completed');
  }
});

// Check processing state
if (form.processing) {
  console.log('Form is being submitted...');
}
```

## Migration from Inertia.js

If you're migrating from Inertia.js or want to use the same patterns, the API is nearly identical:

### Inertia.js
```javascript
import { useForm } from '@inertiajs/react'

const form = useForm({
  name: '',
  email: '',
})

form.post('/users', {
  onSuccess: () => alert('Success!'),
})
```

### axios-form-handler
```typescript
import { useForm } from 'axios-form-handler'

const form = useForm({
  name: '',
  email: '',
})

form.post('/api/contact', {
  onSuccess: () => alert('Success!'),
})
```

The main differences:
- Add `/api` prefix to your routes (or configure Axios base URL)
- Import from `axios-form-handler` instead of `@inertiajs/react`
- Optionally configure custom Axios instance for authentication

### Alpine.js integration

```js

import Alpine from 'alpinejs';
import axios from 'axios';
import { setFormAxios, useForm } from 'axios-form-handler';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf_token"]').getAttribute('content');

setFormAxios(axios);

document.addEventListener('alpine:init', () => {
    Alpine.data('form', (route) => ({
        route,

        init() {
            this.form = useForm({
                first_name: '',
                last_name: '',
                email: '',
            });
        },

        onSubmit() {
            this.form.post(route, {
                onSuccess: (data) => {
                    alert('Message sent successfully!');
                    form.reset();
                },
            });
        },
    }));
});
```
```html
<div x-data="form('/api/register')">
    <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-4">
            <div class="col-span-1 space-y-1.5">
                <label for="first_name">First name</label>
                <input type="text" x-model="form.first_name" />
                <template x-if="form.errors?.first_name">
                    <div class="text-red-600 text-sm" x-text="form.errors?.first_name"></div>
                </template>
            </div>
            <div class="col-span-1 space-y-1.5">
                <label for="last_name">Last name</label>
                <input type="text" x-model="form.last_name" />
                <template x-if="form.errors?.last_name">
                    <div class="text-red-600 text-sm" x-text="form.errors?.last_name"></div>
                </template>
            </div>
            <div class="col-span-2 space-y-1.5">
                <label for="email">E-mail</label>
                <input type="email" x-model="form.email" />
                <template x-if="form.errors?.email">
                    <div class="text-red-600 text-sm" x-text="form.errors?.email"></div>
                </template>
            </div>
            <div class="col-span-2 text-right">
                <button type="submit">Submit</button>
            </div>
        </div>
    </form>
</div>
```


## Contributing

Please, submit bugs or feature requests via the [Github issues](https://github.com/isap-ou/axios-form-handler/issues).

Pull requests are welcomed!

Thanks!

## License

This project is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).

You are free to use, modify, and distribute it in your projects, as long as you comply with the terms of the license.

---

Maintained by [ISAPP](https://isapp.be) and [ISAP OÜ](https://isap.me).  
Check out our software development services at [isap.me](https://isap.me).