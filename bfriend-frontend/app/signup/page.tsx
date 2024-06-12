import Particles from "@/components/ui/particles";
import DevSignupForm from "@/app/signup/signup-form";

export default function SignUp(){
    return(
        <main className={"bg-snow1 h-screen"}>
            <div className={"z-0"}>
                <Particles
                    className="absolute inset-0"
                    quantity={100}
                    ease={80}
                    color={"black"}
                    refresh
                />
            </div>
            <div
                className={
                    "flex relative z-50 justify-center h-screen items-center my-auto mx-auto"
                }
            >
                <div className={"h-[45rem] bg-polar4 rounded-2xl w-[32rem] shadow-2xl"}>
                    <div className={"text-5xl font-semibold w-full mt-7 pb-3 text-center"}>
                        Signup
                    </div>
                    <DevSignupForm />
                </div>
            </div>
        </main>

    )
}