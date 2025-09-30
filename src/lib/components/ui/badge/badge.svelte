<script lang="ts" module>
    import { type VariantProps, tv } from "tailwind-variants";

    export const badgeVariants = tv({
        base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
                secondary:
                    "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
                destructive:
                    "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
                outline:
                    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                buttonMimic:
                    "h-9 px-4 py-2 has-[>svg]:px-3 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-colors bg-white/20 text-white border [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    });

    export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
    import type { HTMLAnchorAttributes } from "svelte/elements";
    import { cn, type WithElementRef } from "$lib/utils.js";

    let {
        ref = $bindable(null),
        href,
        class: className,
        variant = "default",
        children,
        ...restProps
    }: WithElementRef<HTMLAnchorAttributes> & {
        variant?: BadgeVariant;
    } = $props();
</script>

<svelte:element
    this={href ? "a" : "span"}
    bind:this={ref}
    data-slot="badge"
    {href}
    class={cn(badgeVariants({ variant }), className)}
    {...restProps}
>
    {@render children?.()}
</svelte:element>
