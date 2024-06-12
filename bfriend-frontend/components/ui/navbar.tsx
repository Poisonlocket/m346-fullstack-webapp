 import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";


export default function Navbarprod() {
    return (
        <Navbar className={"bg-frost1 z-50 backdrop-blur"}>
            <NavbarBrand >

                <p className="font-bold text-polar2 text-inherit">B-FRIEND</p>
            </NavbarBrand>
            <NavbarContent  className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link  className={"text-polar2 font-semibold"} href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link className={"text-polar2 font-semibold"} href="#" aria-current="page">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link  className={"text-polar2 font-semibold"} href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link className={"text-polar2"} href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} className={"bg-frost2"} href="/signup" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
