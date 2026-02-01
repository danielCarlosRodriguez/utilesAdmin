const BACKEND_URL =
  process.env.VITE_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'https://confident-selena-proyecto-x-ad9040cc.koyeb.app';

const DATABASE = 'utiles';
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

const DRY_RUN = !process.argv.includes('--commit');
const UNSET_CATEGORY = !process.argv.includes('--keep-category');
const UNSET_FIELDS = ['categoría', 'categoria'];

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getResponseData(result) {
  if (result && Object.prototype.hasOwnProperty.call(result, 'data')) {
    return result.data;
  }
  return result;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  const categoriesUrl = `${BACKEND_URL}/api/${DATABASE}/${CATEGORIES_COLLECTION}`;
  const productsUrl = `${BACKEND_URL}/api/${DATABASE}/${PRODUCTS_COLLECTION}`;

  console.log('Loading categories from:', categoriesUrl);
  const categoriesResult = await fetchJson(categoriesUrl);
  const categories = getResponseData(categoriesResult) || [];

  const categoryMap = new Map();
  for (const category of categories) {
    const key = normalizeKey(category.nombre);
    const id =
      typeof category._id === 'string'
        ? category._id
        : category._id && category._id.$oid
          ? category._id.$oid
          : undefined;
    if (key && id) {
      categoryMap.set(key, id);
    }
  }

  console.log('Loading products from:', productsUrl);
  const productsResult = await fetchJson(productsUrl);
  const products = getResponseData(productsResult) || [];

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const product of products) {
    const productId =
      typeof product._id === 'string'
        ? product._id
        : product._id && product._id.$oid
          ? product._id.$oid
          : null;

    if (!productId) {
      skipped += 1;
      continue;
    }

    const categoryKey = normalizeKey(product['categoría'] || product.categoria || product.category);
    const categoryId = categoryMap.get(categoryKey);

    if (!categoryId) {
      missing += 1;
      console.warn('No category match for product:', product.refid || productId, product['categoría']);
      continue;
    }

    const sameCategoryId = product.categoryId && String(product.categoryId) === String(categoryId);
    if (sameCategoryId && !UNSET_CATEGORY) {
      skipped += 1;
      continue;
    }

    if (DRY_RUN) {
      console.log(
        '[dry-run] update product',
        product.refid || productId,
        '->',
        categoryId,
        UNSET_CATEGORY ? '(unset categoría)' : ''
      );
      updated += 1;
      continue;
    }

    const updateUrl = `${BACKEND_URL}/api/${DATABASE}/${PRODUCTS_COLLECTION}/${productId}`;
    const updatePayload = UNSET_CATEGORY
      ? (sameCategoryId ? { __unset: UNSET_FIELDS } : { categoryId, __unset: UNSET_FIELDS })
      : { categoryId };
    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      console.warn('Failed update for', product.refid || productId, response.status);
      continue;
    }

    updated += 1;
  }

  console.log('Done.');
  console.log('updated:', updated);
  console.log('skipped:', skipped);
  console.log('missing category:', missing);
  console.log('mode:', DRY_RUN ? 'dry-run' : 'commit');
  console.log('unset categoria:', UNSET_CATEGORY ? 'yes' : 'no', UNSET_CATEGORY ? UNSET_FIELDS : '');
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
