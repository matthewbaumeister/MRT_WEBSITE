import Image from "next/image";
import Card from "./ui/Card";
import {
  ProgramManagementIcon,
  AIIcon,
  GeospatialIcon,
  ITSupportIcon,
  DataAnalyticsIcon,
  CorporateSupportIcon,
} from "./icons/ServiceIcons";

interface ServiceCardProps {
  title: string;
  description: string;
  fullDescription: string;
  imageSrc?: string;
  imageAlt?: string;
  useIcon?: boolean;
}

const ServiceCard = ({
  title,
  description,
  fullDescription,
  imageSrc,
  imageAlt,
  useIcon = false,
}: ServiceCardProps) => {
  const getIcon = () => {
    switch (title) {
      case "Program Management":
        return <ProgramManagementIcon className="w-20 h-20" />;
      case "Artificial Intelligence":
        return <AIIcon className="w-20 h-20" />;
      case "Geospatial Science":
        return <GeospatialIcon className="w-20 h-20" />;
      case "IT Support":
        return <ITSupportIcon className="w-20 h-20" />;
      case "Data Analytics":
        return <DataAnalyticsIcon className="w-20 h-20" />;
      case "Corporate Support":
        return <CorporateSupportIcon className="w-20 h-20" />;
      default:
        return null;
    }
  };

  return (
    <Card hover className="h-full">
      {useIcon ? (
        <div className="relative h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          {getIcon()}
        </div>
      ) : imageSrc ? (
        <div className="relative h-64 w-full">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative h-64 w-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          {getIcon()}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-primary-600 font-semibold mb-2">{description}</p>
        <p className="text-gray-600">{fullDescription}</p>
      </div>
    </Card>
  );
};

export default ServiceCard;

