import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";
import type { MediaItem } from "@next-wp/content-schema";

interface MobileDrawerProps {
  siteName: string;
  ctaLabel: string;
  ctaHref: string;
  logo?: MediaItem;
}

export function MobileDrawer({ 
  siteName, 
  ctaLabel, 
  ctaHref, 
  logo 
}: MobileDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger>
        <IoMenuSharp className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <div className="">
            <Link
              href="/"
              title="brand-logo"
              className="relative mr-6 flex items-center space-x-2"
            >
              {logo ? (
                <img 
                  src={logo.url} 
                  alt={logo.alt}
                  className="w-auto h-[40px]"
                />
              ) : (
                <Icons.logo className="w-auto h-[40px]" />
              )}
              <span className="font-bold text-xl">{siteName}</span>
            </Link>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({ variant: "default" }),
              "text-white rounded-full group"
            )}
          >
            {ctaLabel}
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
