import { validateSession } from "@/actions/auth";

export default async function PostSection() {
  const { user } = await validateSession();
}
