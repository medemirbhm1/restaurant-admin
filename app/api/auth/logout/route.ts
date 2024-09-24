import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  try {
    const cookie = cookies().delete("token");
    console.log("HIIIIIII");
    return new Response(null, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
