import Image from "next/image";
import Card from "./ui/Card";

interface ServiceCardProps {
  title: string;
  description: string;
  fullDescription: string;
  imageSrc: string;
  imageAlt: string;
}

const ServiceCard = ({
  title,
  description,
  fullDescription,
  imageSrc,
  imageAlt,
}: ServiceCardProps) => {
  return (
    <Card hover className="h-full">
      <div className="relative h-64 w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-primary-600 font-semibold mb-2">{description}</p>
        <p className="text-gray-600">{fullDescription}</p>
      </div>
    </Card>
  );
};

export default ServiceCard;

