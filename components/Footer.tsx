import Link from "next/link";

export const FooterSection = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Product",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "Reports",
          href: "/reports",
        },
        {
          title: "Statistics",
          href: "/statistics",
        },
        {
          title: "Dashboards",
          href: "/dashboards",
        },
        {
          title: "Recordings",
          href: "/recordings",
        },
      ],
    },
  ];

  return (
    <div className="w-full mx-auto py-20 lg:py-40 text-background relative z-10">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Tutor Virtual
              </h2>
              <p className="text-slate-900 dark:text-white text-lg max-w-lg leading-relaxed tracking-tight text-left">
                Managing a small business today is already tough.
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex justify-between items-center"
                    >
                      <span className="text-slate-900 dark:text-white text-xl">
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <p className="text-slate-900 dark:text-white text-xl">
                      {item.title}
                    </p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-900 dark:text-white">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
