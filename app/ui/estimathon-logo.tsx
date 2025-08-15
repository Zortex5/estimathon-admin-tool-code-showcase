import Image from "next/image";

export default function EstimathonLogo() {
  return (
    <div
    className={`position: relative place-items-center`}
    >
      <Image
        className="position: relative w-32 h-32"
        src={`/estimathon-logo.png`}
        alt="Estimathon Tool Logo"
        width={40}
        height={40}
        priority
      />
    </div>
  );
}