"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { diningMenu } from "@/components/DiningMenu/diningMenu-data";
import Copy from "@/components/Copy/Copy";
import Testimonials from "@/components/Testimonials/Testimonials";

import "./menu.css";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_TAGLINES = {
  // Breakfast: "A gentle start, crafted with care",
  Apps: "Plates meant to be passed and savoured together",
  Noodles: "Wood-fired, hand-stretched, classically inspired",
  Sweets: "From bean to glass, every sip considered",
  "Ice Cream": "Small indulgences to end on a sweet note",
};

function flattenCategoryItems(category) {
  if (category.items) return category.items;
  if (category.groups) {
    return category.groups.flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.title })),
    );
  }
  return [];
}

export default function Menu() {
  const menuListRef = useRef(null);

  /* reveal menu rows as each category enters the viewport */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray(".menu-category").forEach((category) => {
        const rows = category.querySelectorAll(".menu-row");

        gsap.set(rows, { autoAlpha: 0, y: 18 });

        ScrollTrigger.create({
          trigger: category,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(rows, {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.045,
              clearProps: "transform",
            });
          },
        });
      });
    }, menuListRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="menu-hero" aria-labelledby="menu-title">
        <div className="menu-hero-inner">
          <div className="menu-hero-copy">
            <p className="menu-eyebrow">Dootsie's / Greenville, SC</p>
            <Copy type="words" animateOnScroll={false} delay={0.2}>
              <h1 id="menu-title">A Menu Guided by Taste and Time</h1>
            </Copy>
            <p className="menu-hero-note">
              Start with something to share. Stay for one more course.
            </p>
          </div>

          <div className="menu-hero-image">
            <Image
              src="/menu/menu-carte.jpg"
              alt="A plated dish from the Dootsie's menu"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
          </div>
        </div>
      </section>

      <nav className="menu-category-nav" aria-label="Menu categories">
        <div className="menu-category-nav-inner">
          {diningMenu.map((category) => {
            const categoryId = category.category
              .toLowerCase()
              .replaceAll(" ", "-");

            return (
              <a key={categoryId} href={`#${categoryId}`}>
                {category.category}
              </a>
            );
          })}
        </div>
      </nav>

      <main className="menu-list" ref={menuListRef}>
        <div className="container">
          {diningMenu.map((category) => {
            const items = flattenCategoryItems(category);
            const tagline = CATEGORY_TAGLINES[category.category];
            const categoryId = category.category
              .toLowerCase()
              .replaceAll(" ", "-");

            return (
              <section
                className="menu-category"
                id={categoryId}
                key={categoryId}
                aria-labelledby={`${categoryId}-title`}
              >
                <div className="menu-category-header">
                  <div className="menu-category-title">
                    <p className="menu-eyebrow">The menu</p>
                    <Copy type="words" animateOnScroll>
                      <h2 id={`${categoryId}-title`}>{category.category}</h2>
                    </Copy>
                  </div>
                  {tagline && (
                    <Copy type="lines" animateOnScroll>
                      <p className="md">{tagline}</p>
                    </Copy>
                  )}
                </div>

                <div className="menu-rows">
                  {items.map((item, itemIndex) => {
                    const isNewGroup =
                      item.group && item.group !== items[itemIndex - 1]?.group;

                    return (
                      <div
                        className="menu-row-wrap"
                        key={`${item.group || categoryId}-${itemIndex}`}
                      >
                        {isNewGroup && (
                          <h3 className="menu-group-heading">{item.group}</h3>
                        )}
                        <article className="menu-row">
                          <div className="menu-row-copy">
                            <h3>{item.name}</h3>
                            {(item.description || item.size) && (
                              <p>{item.description || item.size}</p>
                            )}
                          </div>
                          <div className="menu-row-meta">
                            {item.weight && (
                              <p className="mono">{item.weight}</p>
                            )}
                            {item.price && (
                              <p className="menu-row-price">{item.price}</p>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Testimonials />
    </>
  );
}
