"use client";

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"
import {SunMoon, User} from "lucide-react";
import {useTheme} from "next-themes";

const Nav = () => {
    const { setTheme } = useTheme();
    return (
        <header>
            <Link href={"/"}>
                <Image src={"/images/logo.png"} alt={"Logo"} width={100} height={30} />
            </Link>
            <NavigationMenu>
                <NavigationMenuList className={"gap-4"}>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href={"/"}>Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Flavour</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-75 gap-4 p-2">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link href="#" className={"flex flex-col items-start"}>
                                            <div className="font-medium">Components</div>
                                            <div className="text-muted-foreground">
                                                Browse all components in the library.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link href="#" className={"flex flex-col items-start"}>
                                            <div className="font-medium">Documentation</div>
                                            <div className="text-muted-foreground">
                                                Learn how to use the library.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild className={"flex flex-col items-start"}>
                                        <Link href="#">
                                            <div className="font-medium">Blog</div>
                                            <div className="text-muted-foreground">
                                                Read our latest blog posts.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/news">News</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className={"flex-between gap-4"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}> <SunMoon /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator orientation={"vertical"} />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon"}> <User /> </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Sign In / Sign Up</p>
                    </TooltipContent>
                </Tooltip>
                <Button>Place Order</Button>
                <Separator orientation={"vertical"} />
                <Avatar className={"rounded-full"}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

            </div>
        </header>
    )
}
export default Nav
