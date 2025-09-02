import connectDB from "../../../lib/db";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json() as { name: string; email: string; password: string };

  const exists = await User.findOne({ email: body.email });
  if (exists) return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });

  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = new User({ ...body, password: hashedPassword });
  await user.save();

  return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
}
