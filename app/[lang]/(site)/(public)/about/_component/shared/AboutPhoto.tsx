import Image from "next/image";

export default function AboutPhoto({
    src,
    alt,
    priority = false,
    className = "",
    ratio = "aspect-[4/3]",
}: {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
    ratio?: string; // boleh "aspect-[16/10]" kalau butuh
}) {
    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <div className={`relative w-full ${ratio}`}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover block"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 700px"
                />
            </div>
        </div>
    );
}
