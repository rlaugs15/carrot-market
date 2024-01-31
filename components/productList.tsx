import { ProductWithCount } from "@/pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "sales" | "fav" | "purchases";
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  //ok: boolean 타입에러가 뜨는데 key:stirng에 온갖 key가 다 올 수 있어서 그런다.(sales, fav 등)
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          hearts={record.product._count.Favs}
        />
      ))}
    </>
  ) : null;
}
