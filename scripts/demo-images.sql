-- Point demo rows at front-end images. Idempotent. Leaves QA rows alone.
BEGIN;

UPDATE restaurant
SET "coverImg" = '/demo/restaurants/' || id || '.webp'
WHERE id BETWEEN 1 AND 23
  AND name NOT LIKE 'QA %'
  AND "coverImg" IS DISTINCT FROM '/demo/restaurants/' || id || '.webp';

UPDATE dish
SET photo = '/demo/dishes/' || id || '.webp'
WHERE id BETWEEN 1 AND 12
  AND name NOT LIKE 'QA %'
  AND photo IS DISTINCT FROM '/demo/dishes/' || id || '.webp';

UPDATE category
SET "iconImg" = '/demo/categories/' || slug || '.webp'
WHERE slug IN (
  'mexican',
  'indian',
  'taiwanese',
  'healthy',
  'fast-food',
  'japenese',
  'chinese',
  'all'
)
  AND "iconImg" IS DISTINCT FROM '/demo/categories/' || slug || '.webp';

COMMIT;
