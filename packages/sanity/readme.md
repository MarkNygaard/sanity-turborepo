# @repo/sanity

A package for fetching data from Sanity CMS in your Next.js application.

## Setup

1. Add the following environment variables to your `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Usage

```typescript
import {
  executeQuery,
  executeQueryMultiple,
  executeQuerySingle,
  urlFor,
} from "@repo/sanity";

// Fetch a single document
const post = await executeQuerySingle<Post>(
  `*[_type == "post" && slug.current == $slug][0]`,
  { slug: "my-post" },
);

// Fetch multiple documents
const posts = await executeQueryMultiple<Post>(`*[_type == "post"]`);

// Fetch with caching options
const data = await executeQuery<Data>(`*[_type == "data"]`, undefined, {
  next: {
    revalidate: 3600, // Revalidate every hour
    tags: ["data"],
  },
});

// Generate image URLs
const imageUrl = urlFor(post.mainImage).url();
```

## Features

- Type-safe queries with TypeScript
- Built-in caching with Next.js
- Image URL generation
- Support for GROQ queries
- Automatic CDN usage in production
