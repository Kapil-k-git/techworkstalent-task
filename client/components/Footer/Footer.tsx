import Wave1 from "@/public/assets/images/wave1.png";
import Wave2 from "@/public/assets/images/wave2.png";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="h-[120px] relative bg-[#093545] pt-5">
            <div className="absolute top-0 left-0 w-full h-full z-10">
                <Image src={Wave1} alt="wave1" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0  left-0 w-full h-[100%] z-20">
                <Image src={Wave2} alt="wave2" className="w-full h-full object-cover" />
            </div>
        </footer>
    );
};

export default Footer;
