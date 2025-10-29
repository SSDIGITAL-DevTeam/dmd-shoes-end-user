import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  FaBullseye,
  FaCog,
  FaLayerGroup,
  FaMoneyBillWave,
  FaRecycle,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { inter } from "@/config/font";

type TechnologySectionProps = {
  lang: string;
  dict: any;
  className?: string;
};

const containerClass = "mx-auto w-full max-w-[1200px] px-4 md:px-6";

export default function TechnologySection({ lang, dict, className }: TechnologySectionProps) {
  const featureConfig =
    dict?.technology?.features ??
    {};

  const features = [
    {
      icon: <FaCog size={20} />,
      title: featureConfig?.fastProduction?.title,
      description: featureConfig?.fastProduction?.description,
    },
    {
      icon: <FaRecycle size={20} />,
      title: featureConfig?.recycledMaterial?.title,
      description: featureConfig?.recycledMaterial?.description,
    },
    {
      icon: <FaBullseye size={20} />,
      title: featureConfig?.precisionConsistency?.title,
      description: featureConfig?.precisionConsistency?.description,
    },
    {
      icon: <FaMoneyBillWave size={20} />,
      title: featureConfig?.costEfficiency?.title,
      description: featureConfig?.costEfficiency?.description,
    },
    {
      icon: <FaLayerGroup size={20} />,
      title: featureConfig?.scalability?.title,
      description: featureConfig?.scalability?.description,
    },
  ];

  return (
    <section className={clsx(inter.className, className)}>
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="mb-6 text-xl font-semibold leading-tight text-primary md:text-2xl">
              {dict?.technology?.heading}
            </h2>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded bg-primary p-2 text-white">{feature.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#000000] md:text-[15px]">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 md:text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${lang}/product`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 md:px-5 md:py-2.5 md:text-[15px]"
            >
              {dict?.technology?.button} <HiArrowRight size={18} />
            </Link>
          </div>

          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative aspect-video w-full max-w-[600px] overflow-hidden rounded-lg">
              <Image
                src="/assets/images/home/teknologi-unggulan.webp"
                alt={dict?.technology?.imageAlt || ""}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 600px, 90vw"
                priority={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
