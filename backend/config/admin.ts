// Function to generate preview pathname based on content type and document
const getPreviewPathname = (uid: string, { document }: { document: any }): string | null => {
  const { slug } = document;

  switch (uid) {
    case "api::homepage.homepage":
      return "/";
    case "api::product.product":
      return slug ? `/products/${slug}` : "/products";
    case "api::blog.blog":
      return slug ? `/blog/${slug}` : "/blog";
    case "api::category.category":
      return slug ? `/products?category=${slug}` : "/products";
    default:
      return null;
  }
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Preview configuration
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      async handler(uid: string, { documentId, locale, status }: { documentId: string; locale?: string; status: string }) {
        // @ts-ignore - Strapi types are not fully compatible
        const document = await strapi.documents(uid as any).findOne({ documentId });
        const pathname = getPreviewPathname(uid, { document });

        if (!pathname) return null;

        const params = new URLSearchParams({
          url: pathname,
          secret: env('PREVIEW_SECRET'),
          status,
          documentId,
          contentType: uid,
        });

        return `${env('CLIENT_URL')}/preview?${params}`;
      },
    },
  },
});
