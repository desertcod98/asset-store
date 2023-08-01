import { assets } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

type Asset = InferModel<typeof assets>

export default function Asset(asset: Asset){
  return (
    <div>
      {asset.description}
    </div>
  )
}