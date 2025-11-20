# On-Demand Revalidation API

This API endpoint allows you to trigger on-demand revalidation of cached pages in your Next.js application.

## Setup

1. Add a `REVALIDATION_SECRET` environment variable to your `.env.local` file:
   ```
   REVALIDATION_SECRET=your-secret-key-here
   ```

2. Generate a secure random string for the secret (you can use: `openssl rand -base64 32`)

## Usage

### Revalidate by Path

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/category/database",
    "secret": "your-secret-key-here"
  }'
```

### Revalidate by Tag

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "posts",
    "secret": "your-secret-key-here"
  }'
```

## Common Paths to Revalidate

- Home page: `/`
- Category pages: `/category/[slug]`
- Tag pages: `/tag/[slug]`
- Author pages: `/author/[slug]`
- Post pages: `/posts/[slug]`

## WordPress Integration

You can trigger revalidation from WordPress using a webhook or plugin when content is updated:

```php
// Example WordPress webhook
function trigger_nextjs_revalidation($post_id) {
    $post = get_post($post_id);

    wp_remote_post('https://your-domain.com/api/revalidate', array(
        'body' => json_encode(array(
            'path' => '/posts/' . $post->post_name,
            'secret' => 'your-secret-key-here'
        )),
        'headers' => array('Content-Type' => 'application/json')
    ));
}
add_action('save_post', 'trigger_nextjs_revalidation');
```

## Response

Success:
```json
{
  "revalidated": true,
  "path": "/category/database",
  "now": 1700000000000
}
```

Error:
```json
{
  "error": "Invalid secret"
}
```
