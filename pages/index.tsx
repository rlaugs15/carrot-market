import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout";
import useSWR from "swr";
import FloatingButton from "@/components/floathing-button";
import { Product } from "@prisma/client";
import Item from "@/components/item";

export interface ProductWithCount extends Product {
  _count: {
    Favs: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductResponse>("/api/products");
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y ">
        {data?.products?.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            title={item.name}
            image={item.image}
            price={item.price}
            comments={1}
            hearts={item._count.Favs}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};
export default Home;
