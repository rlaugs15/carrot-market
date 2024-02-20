import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import useSWR, { useSWRConfig } from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import useUser from "@/libs/client/useUser";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductData {
  ok: boolean;
  product: ProductWithUser; //그냥 Product & { user: { id: number; name: string; avatar: string } };도 가능
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const {
    data,
    mutate: boundMutate,
    isLoading,
  } = useSWR<ProductData>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    //Optimistic UI Update이기 때문에 await 제외
    //toggleFav({});
    if (!data) return;
    //상품 이름이 반응형처럼 즉시 바뀜
    if (!isLoading) {
      boundMutate({ ...data, isLiked: !data.isLiked }, false); //두 번째 인자는 다시 데이터를 가져오지 않을 거라 false
      //mutate('/api/users/me',(prev:any)=>({ok:!prev.false}), false) 언바운드 뮤테이트 예시
    }
    toggleFav({});
  };
  return (
    <Layout canGoBack>
      <div className="px-4 py-10">
        <div className="mb-8">
          <img
            src={`https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${data?.product?.image}/public`}
            className="h-96 bg-slate-300"
          />
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <img
              src={`https://imagedelivery.net/FctlJjFO0tAVe2g_0a3fiA/${user?.avatar}/avatar`}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.product?.user?.name}
              </p>
              <Link href={`/users/profiles/${data?.product?.user?.name}`}>
                <p className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </p>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.product.name}
            </h1>
            <span className="text-3xl block mt-3 text-gray-900">
              ${data?.product.price}
            </span>
            <p className=" my-6 text-gray-700">{data?.product.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium hover:bg-orange-600 focus:ring-orange-500 ">
                Talk to seller
              </button>
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ",
                  data?.isLiked
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                <svg
                  className="h-6 w-6 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill={data?.isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <Link href={`/products/${product.id}`}>
                <div key={product.id}>
                  <div className="h-56 w-full mb-4 bg-slate-300" />
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;
