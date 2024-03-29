import AddProjectComponent from "@/components/DashboardComp/AddProjectComp";
import {
  ALL_CATEGORIES_NAME,
  ALL_TAGS_NAME,
  ALL_USERS,
} from "@/services/graphql/queries";
import { currentUserData, getCookie } from "@/services/utils/cookieExtract";
import client from "apollo-client";
import Head from "next/head";

export default function AddProject({
  tags,
  categories,
  clients,
  accessToken,
  visitor,
}) {
  return (
    <div className="page_wrapper">
      <Head>
        <title>Portfolio - Add Project</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AddProjectComponent
          tags={tags}
          categories={categories}
          clients={clients}
          accessToken={accessToken}
          user={visitor}
        />
      </main>
    </div>
  );
}

// to get new added categories and tags from the database we should use getServerSideProps
export async function getServerSideProps({ req, res }) {
  const { cookie } = req.headers;
  const accessToken = getCookie("portfolio_2_0", cookie);
  const visitor = currentUserData("portfolio_2_0", cookie);

  // setting private route
  if (!accessToken) {
    res.setHeader("Set-Cookie", "portfolio_2_0=; path=/; max-age=0");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const tagData = await client.query({
    query: ALL_TAGS_NAME,
  });

  const categoryData = await client.query({
    query: ALL_CATEGORIES_NAME,
  });

  const clientData = await client.query({
    query: ALL_USERS,
  });

  return {
    props: {
      tags: tagData?.data?.listTag || [],
      categories: categoryData?.data?.listCategory || [],
      clients: clientData?.data?.listUser || [],
      accessToken: accessToken || "",
      visitor: visitor || null,
    },
  };
}
