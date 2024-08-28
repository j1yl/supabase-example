import Image from "next/image";

type Props = {
  user: any;
};

export default function Avatar({ user }: Props) {
  return (
    <div className="relative overflow-hidden rounded-full w-6 h-6">
      <Image src={user.avatar_url} alt={`${user.full_name}`} fill />
    </div>
  );
}
