import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
import React from "react";
import { useLocation } from "wouter";
import { Home, Calendar, DollarSign, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "home" | "schedule" | "expenses" | "profile";
}

export default React.memo(function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { key: "home", icon: Home, label: "Home", path: "/" },
    { key: "schedule", icon: Calendar, label: "Schedule", path: "/schedule" },
    { key: "expenses", icon: DollarSign, label: "Expenses", path: "/expenses" },
    { key: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map(({ key, icon: Icon, label, path }) => (
          <button
            key={key}
            className={`flex flex-col items-center py-2 px-3 ${
              activeTab === key ? "text-primary" : "text-gray-400"
            }`}
            onClick={() => setLocation(path)}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { format, differenceInMonths, isThisMonth, isThisYear } from "date-fns";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

interface DashboardInsightsProps {
  pets: Pet[];
  allMedicalRecords: MedicalRecord[];
  reminders: Reminder[];
}

export default function DashboardInsights({ pets, allMedicalRecords, reminders }: DashboardInsightsProps) {
  const now = new Date();
  
  // Calculate health metrics
  const totalPets = pets.length;
  const activeReminders = reminders.filter(r => !r.isCompleted);
  const overdueReminders = reminders.filter(r => r.isOverdue && !r.isCompleted);
  const completedThisMonth = reminders.filter(r => 
    r.isCompleted && r.dueDate && isThisMonth(new Date(r.dueDate))
  );
  
  // Recent medical activity
  const recentRecords = allMedicalRecords.filter(record =>
    isThisMonth(new Date(record.dateAdministered))
  );
  
  // Cost tracking for this year
  const yearlyRecords = allMedicalRecords.filter(record =>
    isThisYear(new Date(record.dateAdministered))
  );
  const totalYearlyCost = yearlyRecords
    .filter(record => record.cost && !isNaN(parseFloat(record.cost)))
    .reduce((sum, record) => sum + parseFloat(record.cost!), 0);
  
  // Vaccination coverage
  const petsWithRecentVaccines = pets.filter(pet => {
    const lastVaccine = allMedicalRecords
      .filter(record => record.petId === pet.id && record.type === 'vaccine')
      .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())[0];
    
    if (!lastVaccine) return false;
    return differenceInMonths(now, new Date(lastVaccine.dateAdministered)) <= 12;
  });
  
  const vaccinationCoverage = totalPets > 0 ? (petsWithRecentVaccines.length / totalPets) * 100 : 0;

  // Health score calculation
  const calculateHealthScore = () => {
    if (totalPets === 0) return 100;
    
    let score = 100;
    
    // Deduct points for overdue reminders
    score -= (overdueReminders.length / totalPets) * 20;
    
    // Add points for completed tasks this month
    score += Math.min(completedThisMonth.length * 5, 20);
    
    // Deduct points for poor vaccination coverage
    if (vaccinationCoverage < 80) {
      score -= (80 - vaccinationCoverage) / 2;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const healthScore = calculateHealthScore();
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-accent";
    return "text-destructive";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Attention";
  };

  return (
    <div className="space-y-4">
      {/* Health Score Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-sm text-gray-600">{getHealthScoreLabel(healthScore)}</div>
              <Progress value={healthScore} className="mt-2 h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Vaccination Coverage</span>
                <span className="text-xs font-medium">{Math.round(vaccinationCoverage)}%</span>
              </div>
              <Progress value={vaccinationCoverage} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tasks Completed</span>
                <span className="text-xs font-medium">{completedThisMonth.length} this month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-gray-900">{totalPets}</div>
            <div className="text-xs text-gray-600">Total Pets</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div className="text-lg font-bold text-gray-900">{activeReminders.length}</div>
            <div className="text-xs text-gray-600">Active Reminders</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-lg font-bold text-gray-900">{recentRecords.length}</div>
            <div className="text-xs text-gray-600">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Costs */}
      <div className="grid grid-cols-1 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-sm">Recent Activity</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {recentRecords.length} this month
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-2">
                {recentRecords.slice(0, 3).map((record) => {
                  const pet = pets.find(p => p.id === record.petId);
                  return (
                    <div key={record.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{record.title}</span>
                        <span className="text-gray-500 ml-1">• {pet?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {format(new Date(record.dateAdministered), "MMM d")}
                      </span>
                    </div>
                  );
                })}
                {recentRecords.length > 3 && (
                  <div className="text-xs text-gray-500 text-center pt-1">
                    +{recentRecords.length - 3} more records
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Summary */}
        {totalYearlyCost > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm">Yearly Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalYearlyCost.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">
                  {yearlyRecords.length} procedures in {now.getFullYear()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Critical Alerts */}
      {overdueReminders.length > 0 && (
        <Card className="border-destructive bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">Needs Immediate Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueReminders.slice(0, 2).map((reminder) => {
                const pet = pets.find(p => p.id === reminder.petId);
                return (
                  <div key={reminder.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-gray-600 ml-1">• {pet?.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">Overdue</Badge>
                  </div>
                );
              })}
              {overdueReminders.length > 2 && (
                <div className="text-xs text-destructive text-center pt-1">
                  +{overdueReminders.length - 2} more overdue
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Success Message */}
      {overdueReminders.length === 0 && activeReminders.length > 0 && (
        <Card className="border-success bg-green-50">
          <CardContent className="p-3 text-center">
            <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
            <div className="text-sm font-medium text-success">All up to date!</div>
            <div className="text-xs text-gray-600">No overdue reminders</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { format, differenceInDays, isAfter, isBefore, addDays } from "date-fns";
import { useLocation } from "wouter";
import type { MedicalRecord, Reminder } from "@shared/schema";

interface HealthSummaryCardProps {
  medicalRecords: MedicalRecord[];
  reminders: Reminder[];
  petId?: number;
  onRecordsClick?: () => void;
}

export default function HealthSummaryCard({ medicalRecords, reminders, petId, onRecordsClick }: HealthSummaryCardProps) {
  const [, setLocation] = useLocation();
  const now = new Date();
  
  // Calculate health metrics
  const totalRecords = medicalRecords.length;
  const overdueReminders = reminders.filter(r => r.isOverdue && !r.isCompleted);
  const upcomingReminders = reminders.filter(r => 
    !r.isOverdue && 
    !r.isCompleted && 
    r.dueDate && 
    differenceInDays(new Date(r.dueDate), now) <= 30
  );
  
  // Latest records by type
  const recordsByType = medicalRecords.reduce((acc, record) => {
    if (!acc[record.type] || new Date(record.dateAdministered) > new Date(acc[record.type].dateAdministered)) {
      acc[record.type] = record;
    }
    return acc;
  }, {} as Record<string, MedicalRecord>);

  // Vaccination status
  const lastVaccine = recordsByType.vaccine;
  const vaccineStatus = lastVaccine 
    ? differenceInDays(now, new Date(lastVaccine.dateAdministered)) <= 365 
      ? "up-to-date" 
      : "due"
    : "missing";

  // Deworming status
  const lastDeworming = recordsByType.deworming;
  const dewormingStatus = lastDeworming 
    ? differenceInDays(now, new Date(lastDeworming.dateAdministered)) <= 90 
      ? "up-to-date" 
      : "due"
    : "missing";

  // Last checkup
  const lastCheckup = recordsByType.checkup;
  const checkupStatus = lastCheckup 
    ? differenceInDays(now, new Date(lastCheckup.dateAdministered)) <= 365 
      ? "recent" 
      : "overdue"
    : "needed";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
      case "recent":
        return "bg-success text-success-foreground";
      case "due":
      case "overdue":
        return "bg-accent text-accent-foreground";
      case "missing":
      case "needed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "Up to date";
      case "recent":
        return "Recent";
      case "due":
        return "Due soon";
      case "overdue":
        return "Overdue";
      case "missing":
        return "Not recorded";
      case "needed":
        return "Needed";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CheckCircle className="w-5 h-5 mr-2 text-primary" />
          Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 h-auto flex flex-col items-center justify-center"
            onClick={() => {
              if (onRecordsClick) {
                onRecordsClick();
              } else if (petId) {
                setLocation(`/pet/${petId}?tab=records`);
              }
            }}
          >
            <div className="text-2xl font-bold text-primary">{totalRecords}</div>
            <div className="text-xs text-gray-600 flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              Total Records
            </div>
          </Button>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-destructive">{overdueReminders.length}</div>
            <div className="text-xs text-gray-600">Overdue Items</div>
          </div>
        </div>

        {/* Health Status Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Vaccinations</span>
            <Badge className={getStatusColor(vaccineStatus)}>
              {formatStatusText(vaccineStatus)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Deworming</span>
            <Badge className={getStatusColor(dewormingStatus)}>
              {formatStatusText(dewormingStatus)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Checkup</span>
            <Badge className={getStatusColor(checkupStatus)}>
              {formatStatusText(checkupStatus)}
            </Badge>
          </div>
        </div>

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 mr-2 text-accent" />
              <span className="text-sm font-medium">Upcoming (Next 30 days)</span>
            </div>
            <div className="space-y-1">
              {upcomingReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{reminder.title}</span>
                  <span className="text-accent font-medium">
                    {reminder.dueDate && format(new Date(reminder.dueDate), "MMM d")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Alerts */}
        {overdueReminders.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
              <span className="text-sm font-medium text-destructive">Needs Attention</span>
            </div>
            <div className="space-y-1">
              {overdueReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="text-xs text-destructive">
                  {reminder.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from "react";
import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
          sizeClasses[size]
        )} />
        <PawPrint className={cn(
          "absolute inset-0 m-auto text-blue-600/20",
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
        )} />
      </div>
      {text && (
        <p className={cn(
          "text-gray-600 font-medium",
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        )}>
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading ASOPETS..." />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-200 border-t-white" />
      <span>Loading...</span>
    </div>
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertMedicalRecordSchema, type InsertMedicalRecord, type MedicalRecordType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Bell } from "lucide-react";
import MultiPhotoUpload from "@/components/multi-photo-upload";

interface ExtraField {
  name: keyof InsertMedicalRecord;
  label: string;
  type: "text" | "textarea" | "date" | "select";
  placeholder?: string;
  options?: string[];
}

interface MedicalRecordFormProps {
  title: string;
  petId: number;
  recordType: MedicalRecordType;
  typeOptions: string[];
  defaultValues: InsertMedicalRecord;
  extraFields?: ExtraField[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function MedicalRecordForm({
  title,
  petId,
  recordType,
  typeOptions,
  defaultValues,
  extraFields = [],
  onCancel,
  onSuccess,
}: MedicalRecordFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertMedicalRecord>({
    resolver: zodResolver(insertMedicalRecordSchema),
    defaultValues,
  });



  const createRecordMutation = useMutation({
    mutationFn: async (data: InsertMedicalRecord) => {
      // Check if online - if not, save to offline storage
      if (!navigator.onLine) {
        const { OfflineStorage } = await import("@/lib/offline-storage");
        const offlineId = OfflineStorage.saveRecord(data);
        return { id: offlineId, offline: true };
      }
      
      try {
        await apiRequest("POST", `/api/pets/${petId}/medical-records`, data);
        return { offline: false };
      } catch (error) {
        // If API fails, save offline as fallback
        const { OfflineStorage } = await import("@/lib/offline-storage");
        const offlineId = OfflineStorage.saveRecord(data);
        return { id: offlineId, offline: true };
      }
    },
    onSuccess: (result) => {
      if (result?.offline) {
        toast({
          title: "Saved Offline",
          description: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} record saved offline. Will sync when online.`,
          variant: "default",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
        queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "reminders"] });
        queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
        toast({
          title: "Success",
          description: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} record saved successfully!`,
        });
      }
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMedicalRecord) => {
    createRecordMutation.mutate(data);
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={onCancel} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{recordType.charAt(0).toUpperCase() + recordType.slice(1)} Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${recordType} type`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Upload - Multiple attachments */}
              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-700">Photo Attachments (Optional)</Label>
                <MultiPhotoUpload
                  onPhotosUploaded={(photos) => {
                    form.setValue('attachments', photos);
                  }}
                  currentPhotos={form.watch('attachments') || []}
                  maxPhotos={3}
                  className="w-full"
                />
              </div>

              <FormField
                control={form.control}
                name="dateAdministered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Administered</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="veterinarian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veterinarian/Clinic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter vet name or clinic" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Extra Fields */}
              {extraFields.map((extraField) => (
                <FormField
                  key={extraField.name}
                  control={form.control}
                  name={extraField.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{extraField.label}</FormLabel>
                      <FormControl>
                        {extraField.type === "textarea" ? (
                          <Textarea 
                            placeholder={extraField.placeholder}
                            {...field}
                            value={String(field.value || "")}
                          />
                        ) : (
                          <Input 
                            type={extraField.type}
                            placeholder={extraField.placeholder}
                            {...field}
                            value={String(field.value || "")}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Reminder Settings */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Bell className="text-secondary mr-3 mt-1 w-5 h-5" />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">Reminder Settings</p>
                    
                    <FormField
                      control={form.control}
                      name="reminderEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Send reminder 1 day before due date
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reminderSms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Send SMS reminder 1 hour before due date
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary text-white hover:bg-green-600"
                disabled={createRecordMutation.isPending}
              >
                {createRecordMutation.isPending ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
import React from "react";
import { Bell, QrCode, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  showNotificationBell?: boolean;
  notificationCount?: number;
  showQRScanner?: boolean;
  showSettings?: boolean;
  onNotificationClick?: () => void;
  onQRScannerClick?: () => void;
  onSettingsClick?: () => void;
}

export default function PageHeader({
  title,
  showNotificationBell = false,
  notificationCount = 0,
  showQRScanner = false,
  showSettings = false,
  onNotificationClick,
  onQRScannerClick,
  onSettingsClick
}: PageHeaderProps) {
  return (
    <div className="bg-primary text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {showNotificationBell && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative"
              onClick={onNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}
          {showQRScanner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={onQRScannerClick}
            >
              <QrCode className="w-5 h-5" />
            </Button>
          )}
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={onSettingsClick}
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { useLocation } from "wouter";
import type { Pet, Reminder } from "@shared/schema";
import { Dog, Cat, Bird, Rabbit, Heart } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  reminders: Reminder[];
}

export default React.memo(function PetCard({ pet, reminders }: PetCardProps) {
  const [, setLocation] = useLocation();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "dog": return <Dog className="w-8 h-8 text-gray-600" />;
      case "cat": return <Cat className="w-8 h-8 text-gray-600" />;
      case "bird": return <Bird className="w-8 h-8 text-gray-600" />;
      case "rabbit": return <Rabbit className="w-8 h-8 text-gray-600" />;
      default: return <Heart className="w-8 h-8 text-gray-600" />;
    }
  };

  const overdueCount = reminders.filter(r => r.isOverdue).length;
  const upcomingCount = reminders.filter(r => !r.isOverdue && !r.isCompleted).length;
  const totalNotifications = overdueCount + upcomingCount;

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setLocation(`/pet/${pet.id}`)}
    >
      {/* Pet Image or Icon */}
      {pet.imageUrl ? (
        <img 
          src={pet.imageUrl} 
          alt={pet.name}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-100 flex items-center justify-center">
          {getCategoryIcon(pet.category)}
        </div>
      )}
      
      <h3 className="text-center font-semibold text-gray-900">{pet.name}</h3>
      <p className="text-center text-xs text-gray-500 mb-2">
        {pet.breed || pet.category.charAt(0).toUpperCase() + pet.category.slice(1)}
      </p>
      
      {/* Notification Badge */}
      {totalNotifications > 0 && (
        <div className={`notification-badge ${overdueCount > 0 ? 'danger' : 'warning'}`}>
          {totalNotifications}
        </div>
      )}
    </div>
  );
});
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhoto?: string;
  className?: string;
}

export default function PhotoUpload({ onPhotoUploaded, currentPhoto, className = "" }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit for mobile compatibility)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create compressed preview for mobile
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio with max 800px width
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(compressedDataUrl);
        onPhotoUploaded(compressedDataUrl);
        
        toast({
          title: "Photo uploaded",
          description: "Your photo has been uploaded successfully.",
        });
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card>
          <CardContent className="p-3">
            <div className="relative">
              <img
                src={preview}
                alt="Uploaded photo"
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 w-6 h-6 p-0"
                onClick={handleRemovePhoto}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {isUploading ? "Uploading..." : "Add Photo"}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {isUploading ? "Please wait..." : "Upload a photo or document"}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={triggerFileInput}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Choose File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={triggerFileInput}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Camera
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Max file size: 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import type { Pet, MedicalRecord } from "@shared/schema";

interface QRCodeGeneratorProps {
  pet: Pet;
  medicalRecords?: MedicalRecord[];
}

export default function QRCodeGenerator({ pet, medicalRecords = [] }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRData = () => {
    const baseUrl = window.location.origin;
    
    // Generate comprehensive pet data including profile and medical records
    const petData = {
      type: "pet_complete",
      pet: {
        name: pet.name,
        category: pet.category,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        microchipId: pet.microchipId,
        birthmarks: pet.birthmarks,
      },
      medicalRecords: medicalRecords.map(record => ({
        type: record.type,
        title: record.title,
        dateAdministered: record.dateAdministered,
        veterinarian: record.veterinarian,
        clinic: record.clinic,
        nextDueDate: record.nextDueDate,
      })),
      recordCount: medicalRecords.length,
      generatedAt: new Date().toISOString(),
      shareUrl: `${baseUrl}/shared/pet/${pet.id}`,
    };
    return JSON.stringify(petData);
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = generateQRData();
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${pet.name}-complete-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code downloaded",
      description: "The QR code has been saved to your device.",
    });
  };

  const copyQRData = async () => {
    try {
      const qrData = generateQRData();
      await navigator.clipboard.writeText(qrData);
      toast({
        title: "Data copied",
        description: "QR code data has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy data to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `${pet.name}-complete-qr.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${pet.name} - Complete Profile & Medical Records`,
          text: `QR code for ${pet.name}'s complete profile and medical records`,
          files: [file],
        });
      } else {
        // Fallback to copying the share URL
        const shareUrl = `${window.location.origin}/shared/pet/${pet.id}`;
        
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Share link copied",
          description: "Share link has been copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share QR code.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [pet, medicalRecords]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-primary" />
            <span>QR Code</span>
          </div>
          <Badge variant="outline">
            Complete Profile & Records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {isGenerating ? (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt={`QR Code for ${pet.name}`}
              className="w-64 h-64 mx-auto border rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p className="font-medium">{pet.name}'s Complete Profile & Medical Records</p>
          <p>Scan to view pet information and {medicalRecords.length} medical record{medicalRecords.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQRCode}
            disabled={!qrCodeUrl}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareQRCode}
            disabled={!qrCodeUrl}
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyQRData}
            className="col-span-2"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy Data
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>QR code contains complete pet profile and medical record information</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { useLocation } from "wouter";

interface QuickActionsProps {
  onFindClinics: () => void;
}

export default function QuickActions({ onFindClinics }: QuickActionsProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 text-lg">Quick Actions</h3>
      
      <div className="space-y-3">
        {/* View Schedule */}
        <button 
          onClick={() => setLocation("/schedule")}
          className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mr-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">View Schedule</h4>
            <p className="text-sm text-gray-600">Check upcoming reminders</p>
          </div>
        </button>

        {/* Find Vet Clinics */}
        <button 
          onClick={onFindClinics}
          className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mr-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">Find Vet Clinics</h4>
            <p className="text-sm text-gray-600">Find vet clinics near you</p>
          </div>
        </button>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ScannedPetData {
  type: string;
  pet: {
    id: number;
    name: string;
    category: string;
    breed?: string;
    age?: number;
    dateOfBirth?: string;
    imageUrl?: string;
    microchipId?: string;
    medicalConditions?: string;
    allergies?: string;
  };
  owner: {
    name: string;
    phone?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  scannedAt: string;
}

interface ScannedPetViewerProps {
  data: ScannedPetData;
  onClose: () => void;
}

export default function ScannedPetViewer({ data, onClose }: ScannedPetViewerProps) {
  const categoryColors = {
    dog: "bg-blue-100 text-blue-800",
    cat: "bg-purple-100 text-purple-800", 
    bird: "bg-yellow-100 text-yellow-800",
    rabbit: "bg-pink-100 text-pink-800",
    horse: "bg-green-100 text-green-800",
    exotic: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Pet Profile
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pet Info */}
          <div className="text-center space-y-2">
            {data.pet.imageUrl && (
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={data.pet.imageUrl} 
                  alt={data.pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800">{data.pet.name}</h3>
            <div className="flex justify-center space-x-2">
              <Badge className={categoryColors[data.pet.category as keyof typeof categoryColors]}>
                {data.pet.category.charAt(0).toUpperCase() + data.pet.category.slice(1)}
              </Badge>
              {data.pet.breed && (
                <Badge variant="outline">{data.pet.breed}</Badge>
              )}
            </div>
            {data.pet.age && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {Math.floor(data.pet.age / 12)} years {data.pet.age % 12} months
              </div>
            )}
            {data.pet.dateOfBirth && (
              <div className="text-sm text-gray-500">
                Born: {format(new Date(data.pet.dateOfBirth), "MMM dd, yyyy")}
              </div>
            )}
          </div>

          {/* Medical Information */}
          {(data.pet.medicalConditions || data.pet.allergies || data.pet.microchipId) && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Medical Information
              </h4>
              
              {data.pet.microchipId && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Microchip ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{data.pet.microchipId}</span>
                </div>
              )}
              
              {data.pet.medicalConditions && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Medical Conditions</span>
                  </div>
                  <p className="text-sm text-yellow-700">{data.pet.medicalConditions}</p>
                </div>
              )}
              
              {data.pet.allergies && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="font-medium text-red-800">Allergies</span>
                  </div>
                  <p className="text-sm text-red-700 font-medium">{data.pet.allergies}</p>
                </div>
              )}
            </div>
          )}

          {/* Owner Info */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Owner Information
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{data.owner.name}</span>
              </div>
              
              {data.owner.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium text-gray-700">Phone:</span>
                  <a href={`tel:${data.owner.phone}`} className="ml-2 text-blue-600 hover:underline">
                    {data.owner.phone}
                  </a>
                </div>
              )}
              
              {data.owner.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <a href={`mailto:${data.owner.email}`} className="ml-2 text-blue-600 hover:underline">
                    {data.owner.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {(data.owner.emergencyContact || data.owner.emergencyPhone) && (
            <div className="border-t pt-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                {data.owner.emergencyContact && (
                  <p className="text-sm text-red-700 font-medium mb-1">
                    {data.owner.emergencyContact}
                  </p>
                )}
                {data.owner.emergencyPhone && (
                  <a href={`tel:${data.owner.emergencyPhone}`} className="text-red-600 hover:underline font-medium">
                    {data.owner.emergencyPhone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 space-y-2">
            <Button className="w-full" onClick={onClose}>
              Close
            </Button>
            <p className="text-xs text-gray-500 text-center">
              This pet's information was shared via QR code
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Smartphone, MessageCircle, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface SMSOTPLoginProps {
  onSuccess: () => void;
  onBackToRegular: () => void;
}

export default function SMSOTPLogin({ onSuccess, onBackToRegular }: SMSOTPLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const sendOTP = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: data.phoneNumber,
      });
      
      setPhoneNumber(data.phoneNumber);
      setStep("otp");
      setResendCooldown(60);
      
      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Handle development mode - show OTP to user
      const apiResponse = response as any;
      if (apiResponse.developmentMode && apiResponse.otp) {
        toast({
          title: "OTP Sent (Development Mode)",
          description: `Your verification code is: ${apiResponse.otp}`,
          duration: 10000, // Show for 10 seconds
        });
      } else {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${data.phoneNumber}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/verify-otp", {
        phoneNumber,
        otp: data.otp,
      });
      
      toast({
        title: "Login successful",
        description: "Welcome to VetBB!",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber,
      });
      
      setResendCooldown(60);
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Resent",
        description: "New verification code sent",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {step === "phone" ? (
              <Smartphone className="w-8 h-8 text-primary" />
            ) : (
              <MessageCircle className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === "phone" ? "Login with SMS" : "Enter Verification Code"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === "phone" 
                ? "Enter your phone number to receive a verification code"
                : `We sent a 6-digit code to ${phoneNumber}`
              }
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "phone" ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(sendOTP)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          {...field}
                          disabled={isLoading}
                          className="text-center text-xl tracking-widest"
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resendOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-sm"
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : "Resend Code"
                    }
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("phone")}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Phone Number
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onBackToRegular}
              className="text-sm text-gray-600"
              disabled={isLoading}
            >
              Back to Regular Login
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Secure SMS Authentication</p>
                <p>Your phone number is encrypted and only used for login verification. SMS charges may apply.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { Bell, QrCode, Download, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StandardHeaderProps {
  title: string;
  subtitle?: string;
  showNotificationBell?: boolean;
  notificationCount?: number;
  showQRScanner?: boolean;
  showDownload?: boolean;
  showLogout?: boolean;
  onNotificationClick?: () => void;
  onQRScannerClick?: () => void;
  onDownloadClick?: () => void;
  onLogoutClick?: () => void;
}

export default function StandardHeader({
  title,
  subtitle,
  showNotificationBell = false,
  notificationCount = 0,
  showQRScanner = false,
  showDownload = false,
  showLogout = false,
  onNotificationClick,
  onQRScannerClick,
  onDownloadClick,
  onLogoutClick
}: StandardHeaderProps) {
  return (
    <div className="bg-primary text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {showQRScanner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onQRScannerClick}
            >
              <QrCode className="w-5 h-5" />
            </Button>
          )}
          {showDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onDownloadClick}
            >
              <Download className="w-5 h-5" />
            </Button>
          )}
          {showNotificationBell && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
              onClick={onNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </Button>
          )}
          {showLogout && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={onLogoutClick}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Clock, Star, Navigation, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VetClinic } from "@shared/schema";

interface VetClinicMapProps {
  clinics: VetClinic[];
  userLocation?: { latitude: number; longitude: number };
  onClose: () => void;
}

export default function VetClinicMap({ clinics, userLocation, onClose }: VetClinicMapProps) {
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [nearestClinic, setNearestClinic] = useState<VetClinic | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && clinics.length > 0) {
      // Find the nearest clinic
      let closest = clinics[0];
      let minDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(closest.latitude || '0'),
        parseFloat(closest.longitude || '0')
      );

      clinics.forEach(clinic => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(clinic.latitude || '0'),
          parseFloat(clinic.longitude || '0')
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = clinic;
        }
      });

      setNearestClinic(closest);
    }
  }, [userLocation, clinics]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const getDirections = (clinic: VetClinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const formatDistance = (clinic: VetClinic): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(clinic.latitude || '0'),
      parseFloat(clinic.longitude || '0')
    );
    return `${distance.toFixed(1)} km away`;
  };

  const getClinicTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case '24hour': return 'bg-blue-100 text-blue-800';
      case 'specialty': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
      <div className="bg-white rounded-lg m-4 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Veterinary Clinics Near You</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row h-[70vh]">
          {/* Map Area - Placeholder for now */}
          <div className="flex-1 bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500 mb-4">Map integration coming soon</p>
                <p className="text-sm text-gray-400">
                  For now, use the "Get Directions" button to open in Google Maps
                </p>
              </div>
            </div>
            
            {/* Clinic markers overlay */}
            <div className="absolute top-4 left-4 right-4">
              {nearestClinic && (
                <Card className="bg-white/95 backdrop-blur-sm border-green-200">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Nearest</Badge>
                      <span className="font-medium text-sm">{nearestClinic.name}</span>
                      <span className="text-xs text-gray-500">{formatDistance(nearestClinic)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Clinic List */}
          <div className="w-full lg:w-96 border-l bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Available Clinics ({clinics.length})</h3>
              
              <div className="space-y-3">
                {clinics.map((clinic) => (
                  <Card 
                    key={clinic.id} 
                    className={`cursor-pointer transition-all ${
                      selectedClinic?.id === clinic.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{clinic.name}</h4>
                          {nearestClinic?.id === clinic.id && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Nearest</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getClinicTypeColor((clinic as any).type || 'general')}`}>
                            {(clinic as any).type || 'General'}
                          </Badge>
                          {userLocation && (
                            <span className="text-xs text-gray-500">{formatDistance(clinic)}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{clinic.address}</span>
                        </div>
                        
                        {clinic.phone && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{clinic.phone}</span>
                          </div>
                        )}
                        
                        {(clinic as any).hours && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{(clinic as any).hours}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">
                              {clinic.averageRating ? Number(clinic.averageRating).toFixed(1) : 'No ratings'}
                            </span>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(clinic);
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Clinic Details */}
        {selectedClinic && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{selectedClinic.name}</h3>
              <Button
                size="sm"
                onClick={() => getDirections(selectedClinic)}
                className="bg-primary text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Address</p>
                <p>{selectedClinic.address}</p>
              </div>
              
              {selectedClinic.phone && (
                <div>
                  <p className="font-medium text-gray-600">Phone</p>
                  <p>{selectedClinic.phone}</p>
                </div>
              )}
              
              {(selectedClinic as any).hours && (
                <div>
                  <p className="font-medium text-gray-600">Hours</p>
                  <p>{(selectedClinic as any).hours}</p>
                </div>
              )}
            </div>
            
            {(selectedClinic as any).description && (
              <div className="mt-3">
                <p className="font-medium text-gray-600 mb-1">About</p>
                <p className="text-sm text-gray-700">{(selectedClinic as any).description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClinicRatingSchema, type VetClinic, type InsertClinicRating } from "@shared/schema";
import { MapPin, Phone, Mail, Star, Plus, Stethoscope, User, Calendar } from "lucide-react";

interface VetClinicsProps {
  onRatingAdded?: (clinicId: number, medicalRecordId?: number) => void;
  medicalRecordId?: number;
}

interface ClinicReviewsProps {
  clinicId: number;
}

function ClinicReviews({ clinicId }: ClinicReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/vet-clinics", clinicId, "ratings"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/vet-clinics/${clinicId}/ratings`);
      return await response.json();
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 border-t">
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-4 p-4 border-t text-center text-gray-500">
        <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-3">User Reviews</h4>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {reviews.map((review: any) => (
          <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {review.userName || review.userLastName 
                      ? `${review.userName || ''} ${review.userLastName || ''}`.trim()
                      : 'Anonymous'
                    }
                  </p>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-xs text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(review.createdAt)}
              </div>
            </div>
            {review.review && (
              <p className="text-sm text-gray-700 ml-11">{review.review}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VetClinics({ onRatingAdded, medicalRecordId }: VetClinicsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showReviews, setShowReviews] = useState<{ [key: number]: boolean }>({});
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Location access denied, will show all clinics
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Fetch vet clinics
  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["/api/vet-clinics", userLocation?.lat, userLocation?.lng],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userLocation) {
        params.append("lat", userLocation.lat.toString());
        params.append("lng", userLocation.lng.toString());
        params.append("radius", "25"); // 25km radius
      }
      const response = await apiRequest("GET", `/api/vet-clinics?${params.toString()}`);
      return await response.json() as VetClinic[];
    },
  });



  const ratingForm = useForm<InsertClinicRating>({
    resolver: zodResolver(insertClinicRatingSchema.omit({ userId: true })),
    defaultValues: {
      clinicId: 0,
      rating: 5,
      review: "",
      medicalRecordId: medicalRecordId || undefined,
    },
  });

  const createRatingMutation = useMutation({
    mutationFn: async (data: Omit<InsertClinicRating, 'userId'>) => {
      await apiRequest("POST", "/api/clinic-ratings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vet-clinics"] });
      queryClient.invalidateQueries({ queryKey: [`/api/vet-clinics/${selectedClinic?.id}/ratings`] });
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
      setShowRatingForm(false);
      setSelectedClinic(null);
      if (onRatingAdded && selectedClinic) {
        onRatingAdded(selectedClinic.id, medicalRecordId);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRateClinic = (clinic: VetClinic) => {
    setSelectedClinic(clinic);
    ratingForm.setValue("clinicId", clinic.id);
    setShowRatingForm(true);
  };

  const toggleReviews = (clinicId: number) => {
    setShowReviews(prev => ({
      ...prev,
      [clinicId]: !prev[clinicId]
    }));
  };

  const onSubmitRating = (data: InsertClinicRating) => {
    createRatingMutation.mutate(data);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDistance = (clinic: VetClinic) => {
    if (!userLocation || !clinic.latitude || !clinic.longitude) return "";
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      parseFloat(clinic.latitude),
      parseFloat(clinic.longitude)
    );
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI/180);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Stethoscope className="w-4 h-4 mr-2" />
            Find Vet Clinics
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Local Veterinary Clinics</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {clinics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No veterinary clinics found in your area.</p>
                  <p className="text-sm">Try expanding your search radius or check back later.</p>
                </div>
              ) : (
                clinics.map((clinic: VetClinic) => (
                  <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center mb-1">
                            {renderStars(Math.round(parseFloat(clinic.averageRating || "0")))}
                            <span className="ml-2 text-sm text-gray-600">
                              {parseFloat(clinic.averageRating || "0").toFixed(1)}
                            </span>
                          </div>
                          {(clinic.totalRatings || 0) > 0 && (
                            <span className="text-xs text-gray-500">
                              {clinic.totalRatings} review{clinic.totalRatings !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm">{clinic.address}</p>
                          {formatDistance(clinic) && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {formatDistance(clinic)} away
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {clinic.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{clinic.phone}</span>
                        </div>
                      )}
                      
                      {clinic.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{clinic.email}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2 gap-2">
                        {(clinic.totalRatings || 0) > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReviews(clinic.id)}
                          >
                            {showReviews[clinic.id] ? 'Hide Reviews' : 'View Reviews'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateClinic(clinic)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Clinic
                        </Button>
                      </div>

                      {/* Reviews Section */}
                      {showReviews[clinic.id] && <ClinicReviews clinicId={clinic.id} />}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Form Dialog */}
      <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {selectedClinic?.name}</DialogTitle>
          </DialogHeader>
          
          <Form {...ratingForm}>
            <form onSubmit={ratingForm.handleSubmit(onSubmitRating)} className="space-y-4">
              <FormField
                control={ratingForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5 stars)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= field.value
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-200"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {field.value} star{field.value !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={ratingForm.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this clinic..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRatingForm(false)}
                  disabled={createRatingMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createRatingMutation.isPending}
                >
                  {createRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Heart, 
  Pill, 
  Clock, 
  CheckCircle, 
  X,
  Zap,
  Sparkles,
  PawPrint
} from "lucide-react";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { notificationSounds } from "@/lib/notification-sounds";
import type { Reminder, Pet } from "@shared/schema";

interface CuteNotificationProps {
  reminder: Reminder;
  pet: Pet;
  onComplete: (reminderId: number) => void;
  onDismiss: (reminderId: number) => void;
  onSnooze: (reminderId: number, minutes: number) => void;
}

const petEmojis: Record<string, string> = {
  dog: "🐕",
  cat: "🐱", 
  bird: "🐦",
  rabbit: "🐰",
  other: "🐾"
};

const medicationEmojis: Record<string, string> = {
  vaccine: "💉",
  deworming: "💊",
  treatment: "🩹",
  surgery: "🏥",
  checkup: "🩺",
  "lab-test": "🔬"
};

export default function CuteNotification({ 
  reminder, 
  pet, 
  onComplete, 
  onDismiss, 
  onSnooze 
}: CuteNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const getUrgencyLevel = () => {
    if (!reminder.dueDate) return "normal";
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) return "overdue";
    if (hoursUntilDue < 2) return "urgent";
    if (hoursUntilDue < 24) return "soon";
    return "normal";
  };

  const sendPushNotification = async (reminder: Reminder, pet: Pet, urgency: string) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const petEmoji = petEmojis[pet.category] || "🐾";
          const medicationEmoji = medicationEmojis[reminder.type] || "💊";
          
          new Notification(`${petEmoji} ${pet.name} - ${reminder.type} reminder`, {
            body: `${medicationEmoji} ${reminder.title}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `reminder-${reminder.id}`,
            requireInteraction: urgency === "urgent" || urgency === "overdue",

          });
        }
      } catch (error) {
        console.log('Push notification error:', error);
      }
    }
  };

  useEffect(() => {
    if (!hasPlayed) {
      // Play appropriate sound and send push notification
      const urgency = getUrgencyLevel();
      
      // Send push notification
      sendPushNotification(reminder, pet, urgency);
      
      // Play sound
      setTimeout(() => {
        if (urgency === "urgent" || urgency === "overdue") {
          notificationSounds.playUrgentAlert();
        } else {
          notificationSounds.playGentleChime();
        }
        setHasPlayed(true);
      }, 300);
    }
  }, [hasPlayed]);

  const handleComplete = () => {
    notificationSounds.playCompletionSound();
    setIsVisible(false);
    setTimeout(() => onComplete(reminder.id), 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(reminder.id), 300);
  };

  const handleSnooze = (minutes: number) => {
    notificationSounds.playSnoozeSound();
    setIsVisible(false);
    setTimeout(() => onSnooze(reminder.id, minutes), 300);
  };

  const urgency = getUrgencyLevel();
  const petEmoji = petEmojis[pet.category as keyof typeof petEmojis] || petEmojis.other;
  const medicationEmoji = medicationEmojis[reminder.type as keyof typeof medicationEmojis] || "💊";

  const urgencyStyles = {
    overdue: "border-red-200 bg-red-50 shadow-red-100",
    urgent: "border-orange-200 bg-orange-50 shadow-orange-100",
    soon: "border-yellow-200 bg-yellow-50 shadow-yellow-100",
    normal: "border-blue-200 bg-blue-50 shadow-blue-100"
  };

  const urgencyColors = {
    overdue: "text-red-800",
    urgent: "text-orange-800", 
    soon: "text-yellow-800",
    normal: "text-blue-800"
  };

  const getTimeDisplay = () => {
    if (!reminder.dueDate) return "";
    const dueDate = new Date(reminder.dueDate);
    
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM d");
  };

  // Check if reminder should show - only 1 day before due date
  const shouldShowNotification = () => {
    if (reminder.isCompleted) return false;
    
    const now = new Date();
    const dueDate = new Date(reminder.dueDate);
    const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Show notification only when due date is between 23-25 hours away (1 day with tolerance)
    return diffInHours >= 23 && diffInHours <= 25;
  };

  // Don't show notification if not due tomorrow or already completed
  if (!isVisible || !shouldShowNotification()) return null;

  return (
    <Card 
      className={`
        max-w-sm w-full mx-auto 
        ${urgencyStyles[urgency]} 
        transition-all duration-300 transform hover:scale-105 
        shadow-lg border-2 relative overflow-hidden
      `}
    >
      {/* Cute sparkle animation for urgent reminders */}
      {urgency === "urgent" && (
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
      )}
      
      {/* Overdue warning flash */}
      {urgency === "overdue" && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Pet avatar with medication icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-gray-100">
                {petEmoji}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm border-2 border-gray-100">
                {medicationEmoji}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-semibold ${urgencyColors[urgency]}`}>
                  {pet.name}'s {reminder.type}
                </h3>
                {urgency === "overdue" && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    Overdue
                  </Badge>
                )}
                {urgency === "urgent" && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{reminder.title}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeDisplay()}</span>
                </div>
                {reminder.dueDate && (
                  <div className="flex items-center space-x-1">
                    <PawPrint className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(reminder.dueDate), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="p-1 h-6 w-6 hover:bg-white/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
          {!showSnoozeOptions ? (
            <div className="flex space-x-2">
              <Button
                onClick={handleComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Done
              </Button>
              
              <Button
                onClick={() => setShowSnoozeOptions(true)}
                variant="outline"
                className="flex-1 text-sm py-2"
              >
                <Bell className="w-4 h-4 mr-2" />
                Snooze
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleSnooze(15)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  15 min
                </Button>
                <Button
                  onClick={() => handleSnooze(30)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  30 min
                </Button>
                <Button
                  onClick={() => handleSnooze(60)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  1 hour
                </Button>
                <Button
                  onClick={() => handleSnooze(240)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  4 hours
                </Button>
              </div>
              <Button
                onClick={() => setShowSnoozeOptions(false)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Cute motivational message */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 italic">
            {urgency === "overdue" 
              ? `${pet.name} is counting on you! 🥺`
              : urgency === "urgent"
              ? `${pet.name} needs attention soon! 💕`
              : `Keep ${pet.name} healthy and happy! ✨`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface MedicalAttachmentViewerProps {
  attachments: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function MedicalAttachmentViewer({ 
  attachments, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: MedicalAttachmentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % attachments.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + attachments.length) % attachments.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Medical Record Attachments ({currentIndex + 1}/{attachments.length})</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleZoom}>
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          {/* Navigation arrows */}
          {attachments.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {/* Image */}
          <img
            src={attachments[currentIndex]}
            alt={`Medical attachment ${currentIndex + 1}`}
            className={`max-w-full transition-all duration-200 ${
              isZoomed 
                ? 'max-h-none w-full cursor-zoom-out' 
                : 'max-h-[60vh] object-contain cursor-zoom-in'
            }`}
            onClick={toggleZoom}
          />
        </div>
        
        {/* Thumbnail navigation */}
        {attachments.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4 max-w-full overflow-x-auto pb-2">
            {attachments.map((attachment, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={attachment}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Syringe, 
  PillBottle, 
  Heart as MedicalKit, 
  UserCog, 
  Stethoscope,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Trash2,
  Eye,
  Camera
} from "lucide-react";
import MedicalAttachmentViewer from "@/components/medical-attachment-viewer";
import { format, isValid } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MedicalRecord } from "@shared/schema";

interface MedicalTimelineProps {
  petId: number;
  medicalRecords: MedicalRecord[];
}

export default function MedicalTimeline({ petId, medicalRecords }: MedicalTimelineProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentIndex, setAttachmentIndex] = useState(0);

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      await apiRequest("DELETE", `/api/pets/${petId}/medical-records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "reminders"] });
      toast({
        title: "Record deleted",
        description: "Medical record has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'lab-test': return <FileText {...iconProps} />;
      default: return <Stethoscope {...iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800 border-green-200';
      case 'deworming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treatment': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'surgery': return 'bg-red-100 text-red-800 border-red-200';
      case 'checkup': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lab-test': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
  };

  const formatType = (type: string) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
  };

  const handleDeleteRecord = (recordId: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  if (medicalRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">No Medical Records</h3>
          <p className="text-gray-500 text-sm">
            Start tracking your pet's health by adding their first medical record.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort records by date (newest first)
  const sortedRecords = [...medicalRecords].sort(
    (a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Medical History</h3>
        <span className="text-sm text-gray-500">{medicalRecords.length} records</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {sortedRecords.map((record, index) => (
            <div key={record.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white ${
                index === 0 ? 'bg-primary' : 'bg-gray-300'
              } shadow-sm`}></div>
              
              {/* Record card */}
              <Card className="ml-12 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRecordClick(record)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`activity-icon ${record.type}`}>
                          {getActivityIcon(record.type)}
                        </div>
                        <Badge variant="outline" className={getTypeColor(record.type)}>
                          {formatType(record.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(record.dateAdministered)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{record.title}</h4>
                      
                      {record.description && (
                        <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      )}

                      <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                        {record.veterinarian && (
                          <div className="flex items-center">
                            <Stethoscope className="w-3 h-3 mr-1" />
                            <span>Dr. {record.veterinarian}</span>
                          </div>
                        )}
                        
                        {record.clinic && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{record.clinic}</span>
                          </div>
                        )}
                        
                        {record.cost && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>₱{record.cost}</span>
                          </div>
                        )}
                        
                        {record.batchNumber && (
                          <div className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            <span>Batch: {record.batchNumber}</span>
                          </div>
                        )}
                      </div>

                      {record.nextDueDate && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          <span className="text-amber-800">
                            Next due: {formatDate(record.nextDueDate)}
                          </span>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.imageUrl && (
                        <div className="mt-2">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            <span>Attached document</span>
                          </div>
                          <img 
                            src={record.imageUrl} 
                            alt="Medical record"
                            className="max-w-32 h-auto rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecord(record.id, record.title);
                      }}
                      disabled={deleteRecordMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md" aria-describedby="record-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecord && getActivityIcon(selectedRecord.type)}
              {selectedRecord?.title}
            </DialogTitle>
          </DialogHeader>
          <div id="record-details">
            {selectedRecord && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTypeColor(selectedRecord.type)}>
                    {formatType(selectedRecord.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedRecord.dateAdministered)}
                  </span>
                </div>

                {selectedRecord.description && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-600">{selectedRecord.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {selectedRecord.veterinarian && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Veterinarian</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Dr. {selectedRecord.veterinarian}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.clinic && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Clinic</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedRecord.clinic}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.cost && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Cost</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ₱{selectedRecord.cost}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.batchNumber && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Batch Number</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {selectedRecord.batchNumber}
                      </div>
                    </div>
                  )}
                </div>

                {selectedRecord.nextDueDate && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <h4 className="font-medium text-sm text-amber-800 mb-1">Next Due Date</h4>
                    <div className="flex items-center text-sm text-amber-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(selectedRecord.nextDueDate)}
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Notes</h4>
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                      {selectedRecord.notes}
                    </div>
                  </div>
                )}

                {selectedRecord.imageUrl && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Attached Document</h4>
                    <img 
                      src={selectedRecord.imageUrl} 
                      alt="Medical record document"
                      className="w-full h-auto rounded border max-h-48 object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CuteNotification from "@/components/cute-notification";
import type { Reminder, Pet } from "@shared/schema";

interface ReminderWithPet extends Reminder {
  pet: Pet;
}

export default function MedicationReminderManager() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [snoozedReminders, setSnoozedReminders] = useState<Set<number>>(new Set());
  const [dismissedReminders, setDismissedReminders] = useState<Set<number>>(new Set());

  // Fetch active reminders with pet details
  const { data: reminders = [] } = useQuery<ReminderWithPet[]>({
    queryKey: ["/api/reminders/with-pets"],
    queryFn: async () => {
      const [remindersResponse, petsResponse] = await Promise.all([
        apiRequest("GET", "/api/reminders"),
        apiRequest("GET", "/api/pets")
      ]);
      
      const reminderData = await remindersResponse.json();
      const petData = await petsResponse.json();
      
      // Combine reminders with pet information
      return reminderData.map((reminder: Reminder) => {
        const pet = petData.find((p: Pet) => p.id === reminder.petId);
        return { ...reminder, pet };
      }).filter((r: ReminderWithPet) => r.pet); // Only include reminders with valid pets
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Check for new reminders every 30 seconds
  });

  // Complete reminder mutation
  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: number) => {
      await apiRequest("PUT", `/api/reminders/${reminderId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/with-pets"] });
      toast({
        title: "Reminder completed",
        description: "Great job taking care of your pet!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Snooze reminder (local state management)
  const handleSnooze = (reminderId: number, minutes: number) => {
    setSnoozedReminders(prev => new Set(Array.from(prev).concat(reminderId)));
    
    // Remove from snoozed after the specified time
    setTimeout(() => {
      setSnoozedReminders(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(reminderId);
        return newSet;
      });
    }, minutes * 60 * 1000);

    toast({
      title: "Reminder snoozed",
      description: `We'll remind you again in ${minutes} minutes`,
    });
  };

  // Dismiss reminder (local state management)
  const handleDismiss = (reminderId: number) => {
    setDismissedReminders(prev => new Set(Array.from(prev).concat(reminderId)));
    
    toast({
      title: "Reminder dismissed",
      description: "You can find this reminder in your schedule",
    });
  };

  // Filter reminders to show
  const activeReminders = reminders.filter(reminder => 
    !reminder.isCompleted && 
    !snoozedReminders.has(reminder.id) && 
    !dismissedReminders.has(reminder.id)
  );

  // Get urgent reminders (due today or overdue)
  const urgentReminders = activeReminders.filter(reminder => {
    if (!reminder.dueDate) return false;
    const dueDate = new Date(reminder.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  });

  // Show notification permission request for urgent reminders
  useEffect(() => {
    if (urgentReminders.length > 0 && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            // Show browser notification for urgent reminders
            urgentReminders.forEach(reminder => {
              if (reminder.pet) {
                new Notification(`${reminder.pet.name}'s ${reminder.type}`, {
                  body: reminder.title,
                  icon: "/favicon.ico",
                  tag: `reminder-${reminder.id}`,
                });
              }
            });
          }
        });
      } else if (Notification.permission === "granted") {
        // Show notifications for new urgent reminders
        urgentReminders.forEach(reminder => {
          if (reminder.pet) {
            new Notification(`${reminder.pet.name}'s ${reminder.type}`, {
              body: reminder.title,
              icon: "/favicon.ico",
              tag: `reminder-${reminder.id}`,
            });
          }
        });
      }
    }
  }, [urgentReminders.length]);

  if (!isAuthenticated || activeReminders.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {activeReminders.slice(0, 3).map((reminder) => (
        <CuteNotification
          key={reminder.id}
          reminder={reminder}
          pet={reminder.pet}
          onComplete={(id) => completeReminderMutation.mutate(id)}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
        />
      ))}
      
      {activeReminders.length > 3 && (
        <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-2 shadow-md border">
          +{activeReminders.length - 3} more reminders in your schedule
        </div>
      )}
    </div>
  );
}
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon, ZoomIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MultiPhotoUploadProps {
  onPhotosUploaded: (urls: string[]) => void;
  currentPhotos?: string[];
  maxPhotos?: number;
  className?: string;
}

export default function MultiPhotoUpload({ 
  onPhotosUploaded, 
  currentPhotos = [], 
  maxPhotos = 3,
  className = "" 
}: MultiPhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(currentPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio with max 800px width
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${maxPhotos} photos.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newPhotos: string[] = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please select only image files.",
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select images smaller than 5MB.",
            variant: "destructive",
          });
          continue;
        }

        const compressedPhoto = await compressImage(file);
        newPhotos.push(compressedPhoto);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosUploaded(updatedPhotos);
      
      if (newPhotos.length > 0) {
        toast({
          title: "Photos uploaded",
          description: `${newPhotos.length} photo(s) uploaded successfully.`,
        });
      }

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosUploaded(updatedPhotos);
    
    toast({
      title: "Photo removed",
      description: "Photo has been removed successfully.",
    });
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="space-y-4">
        {/* Upload Controls */}
        {photos.length < maxPhotos && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraCapture}
              disabled={isUploading}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Camera"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Gallery"}
            </Button>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(index);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                No photos uploaded
              </p>
              <p className="text-xs text-gray-500">
                You can upload up to {maxPhotos} photos
              </p>
            </CardContent>
          </Card>
        )}

        {/* Photo Count */}
        {photos.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {photos.length} of {maxPhotos} photos uploaded
          </p>
        )}
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Viewer</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="flex justify-center">
              <img
                src={selectedPhoto}
                alt="Zoomed photo"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React from "react";
import { WifiOff, Wifi } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert className={`max-w-sm mx-auto ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={isOnline ? 'text-green-800' : 'text-red-800'}>
            {isOnline ? 'Connection restored' : 'You are offline. Some features may be limited.'}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, CloudOff, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OfflineStorage } from "@/lib/offline-storage";

export default function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({ hasOfflineData: false, count: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for offline data on mount and periodically
    const checkOfflineData = () => {
      const indicator = OfflineStorage.getOfflineIndicator();
      setOfflineData(indicator);
    };

    checkOfflineData();
    const interval = setInterval(checkOfflineData, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      await OfflineStorage.syncPendingData();
      setOfflineData({ hasOfflineData: false, count: 0 });
      toast({
        title: "Sync completed",
        description: "All offline data has been synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Some data could not be synchronized. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineData.hasOfflineData && !isSyncing) {
      setTimeout(() => {
        handleSync();
      }, 2000); // Wait 2 seconds after coming online
    }
  }, [isOnline]);

  if (!offlineData.hasOfflineData && isOnline) {
    return null; // Don't show anything when everything is synced and online
  }

  return (
    <Card className={`mb-4 ${!isOnline ? 'border-amber-200 bg-amber-50' : offlineData.hasOfflineData ? 'border-blue-200 bg-blue-50' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-amber-600" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                {offlineData.hasOfflineData && (
                  <Badge variant="outline" className="text-xs">
                    {offlineData.count} unsynced
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {!isOnline 
                  ? 'Working offline - data will sync when online'
                  : offlineData.hasOfflineData 
                    ? 'You have unsynced data'
                    : 'All data synchronized'
                }
              </p>
            </div>
          </div>

          {offlineData.hasOfflineData && isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center"
            >
              {isSyncing ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}

          {!isOnline && (
            <CloudOff className="w-5 h-5 text-amber-600" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPetSchema, type Pet, type InsertPet, type PetCategory } from "@shared/schema";
import { Edit3, Dog, Cat, Bird, Rabbit, Heart } from "lucide-react";
import PhotoUpload from "./photo-upload";

const petCategories: { value: PetCategory; label: string; icon: any }[] = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "bird", label: "Bird", icon: Bird },
  { value: "rabbit", label: "Rabbit", icon: Rabbit },
  { value: "horse", label: "Horse", icon: Heart },
  { value: "exotic", label: "Exotic", icon: Heart },
  { value: "other", label: "Other", icon: Heart },
];

interface PetEditFormProps {
  pet: Pet;
}

export default function PetEditForm({ pet }: PetEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema.omit({ userId: true })),
    defaultValues: {
      name: pet?.name || "",
      category: pet?.category || "dog",
      breed: pet?.breed || "",
      dateOfBirth: pet?.dateOfBirth || "",
      age: pet?.age || 0,
      microchipId: pet?.microchipId || "",
      birthmarks: pet?.birthmarks || "",
      imageUrl: pet?.imageUrl || "",
    },
  });

  // Reset form when pet data changes
  useEffect(() => {
    if (pet && pet.id) {
      form.reset({
        name: pet.name || "",
        category: pet.category || "dog",
        breed: pet.breed || "",
        dateOfBirth: pet.dateOfBirth || "",
        age: pet.age || 0,
        microchipId: pet.microchipId || "",
        birthmarks: pet.birthmarks || "",
        imageUrl: pet.imageUrl || "",
      });
    }
  }, [pet, form]);

  const updatePetMutation = useMutation({
    mutationFn: async (data: Omit<InsertPet, 'userId'>) => {
      if (!pet?.id) {
        throw new Error("Pet ID is required");
      }
      await apiRequest("PUT", `/api/pets/${pet.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}`] });
      toast({
        title: "Success",
        description: "Pet information updated successfully!",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPet) => {
    updatePetMutation.mutate(data);
  };

  const handlePhotoUploaded = (url: string) => {
    form.setValue("imageUrl", url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Pet Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pet Information</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pet Photo</label>
              <PhotoUpload
                onPhotoUploaded={handlePhotoUploaded}
                currentPhoto={form.watch("imageUrl") || ""}
                className="mx-auto"
              />
            </div>

            {/* Pet Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pet Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {category.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Breed */}
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter breed" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ? field.value.toString() : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (in months)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter age in months" 
                      {...field} 
                      value={field.value || ""} 
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Microchip ID */}
            <FormField
              control={form.control}
              name="microchipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Microchip ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter microchip ID" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthmarks */}
            <FormField
              control={form.control}
              name="birthmarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthmarks / Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any distinctive marks or remarks"
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={updatePetMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updatePetMutation.isPending}
              >
                {updatePetMutation.isPending ? "Updating..." : "Update Pet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import React from "react";

interface AnimatedPetMascotProps {
  isScanning: boolean;
  scanSuccess: boolean;
  petCategory?: string;
}

const petMascots = {
  dog: "🐕",
  cat: "🐱", 
  bird: "🐦",
  rabbit: "🐰",
  horse: "🐴",
  exotic: "🦎",
  other: "🐾"
};

export default function AnimatedPetMascot({ isScanning, scanSuccess, petCategory = "other" }: AnimatedPetMascotProps) {
  const mascot = petMascots[petCategory as keyof typeof petMascots] || petMascots.other;
  
  const getAnimationClass = () => {
    if (scanSuccess) {
      return "animate-bounce";
    } else if (isScanning) {
      return "animate-pulse";
    } else {
      return "animate-pulse";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`text-6xl transition-all duration-500 ${getAnimationClass()}`}
        style={{
          transform: scanSuccess ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {mascot}
      </div>
      
      <div className="text-center min-h-[2rem]">
        {isScanning && (
          <div className="flex items-center space-x-2 justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Looking for QR codes...</span>
          </div>
        )}
        
        {scanSuccess && (
          <div className="text-green-600 text-lg font-semibold animate-pulse">
            🎉 Found a pet!
          </div>
        )}
        
        {!isScanning && !scanSuccess && (
          <div className="text-center text-gray-500 text-sm">
            Ready to scan pet QR codes
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import jsQR from "jsqr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, X, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimatedPetMascot from "./animated-pet-mascot";
import FloatingParticles from "./floating-particles";

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (data: any) => void;
}

export default function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedPetCategory, setScannedPetCategory] = useState<string>("other");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      
      // Start scanning for QR codes
      startQRDetection();

    } catch (err) {
      setError("Camera access denied or not available");
      setIsScanning(false);
    }
  };

  const startQRDetection = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !video || !context) return;

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            try {
              const qrData = JSON.parse(code.data);
              if (qrData.type === 'pet_profile' && qrData.petId && qrData.ownerId) {
                setScanSuccess(true);
                toast({
                  title: "Pet QR Code Found!",
                  description: "Loading pet information...",
                });
                
                // Show success animation before processing
                setTimeout(() => {
                  stopCamera();
                  onScanSuccess(qrData);
                }, 1500);
                return;
              } else {
                setError('This QR code is not a valid pet profile. Please scan a pet QR code.');
                setTimeout(() => setError(null), 3000);
              }
            } catch (e) {
              setError('Invalid QR code format. Please scan a valid pet profile QR code.');
              setTimeout(() => setError(null), 3000);
            }
          }
        } catch (err) {
          console.error("QR detection error:", err);
        }
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    setScanSuccess(false);
  };

  const handleTestScan = () => {
    // Generate a test QR code for the current user's first pet (if any)
    const testData = {
      type: "pet_profile",
      petId: 10, // Using the pet ID from the logs
      ownerId: "6f1a0727-3380-4dd8-b401-8483bb8c57f8",
      timestamp: new Date().toISOString(),
    };

    setScanSuccess(true);
    setScannedPetCategory("rabbit"); // Based on the pet data from logs
    
    toast({
      title: "Test QR Code Scanned!",
      description: "Loading real pet information...",
    });

    // Show success animation before processing
    setTimeout(() => {
      stopCamera();
      onScanSuccess(testData);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        <FloatingParticles show={scanSuccess} />
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pet Mascot Animation */}
          <AnimatedPetMascot 
            isScanning={isScanning} 
            scanSuccess={scanSuccess}
            petCategory={scannedPetCategory}
          />
          
          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Scan a pet's QR code to view their profile and medical records.
              </p>
              
              <Button onClick={startCamera} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>

              <Button 
                variant="outline" 
                onClick={handleTestScan}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Test Scan (Real Data)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* QR Code overlay with animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className={`w-48 h-48 border-2 rounded-lg transition-all duration-300 ${
                      scanSuccess 
                        ? 'border-green-400 border-solid opacity-90 shadow-lg shadow-green-400/50' 
                        : 'border-white border-dashed opacity-70'
                    }`}
                  >
                    {/* Scanning line animation */}
                    {isScanning && !scanSuccess && (
                      <div className="relative w-full h-full overflow-hidden">
                        <div className="absolute w-full h-0.5 bg-blue-400 opacity-80 animate-ping"></div>
                        <div 
                          className="absolute w-full h-0.5 bg-blue-400"
                          style={{
                            animation: 'scan-line 2s linear infinite',
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  Stop Camera
                </Button>
                <Button onClick={handleTestScan} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Test Scan
                </Button>
              </div>

              {!scanSuccess && (
                <p className="text-xs text-gray-500 text-center">
                  Position the QR code within the frame to scan
                </p>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from "react";

interface FloatingParticlesProps {
  show: boolean;
}

export default function FloatingParticles({ show }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 80,
        y: 50 + (Math.random() - 0.5) * 80,
      }));
      setParticles(newParticles);
      
      // Clear particles after animation
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  );
}
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <p className="text-gray-600">
                ASOPETS encountered an unexpected error. We apologize for the inconvenience.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  variant="outline" 
                  className="w-full"
                >
                  Reload App
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-600 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
import React from "react";
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertPetSchema, type InsertPet, type PetCategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Camera, Image, Dog, Cat, Bird, Rabbit, Heart, X } from "lucide-react";

const petCategories: { value: PetCategory; label: string; icon: any }[] = [
  { value: "dog", label: "Dogs", icon: Dog },
  { value: "cat", label: "Cats", icon: Cat },
  { value: "bird", label: "Birds", icon: Bird },
  { value: "rabbit", label: "Rabbits", icon: Rabbit },
  { value: "horse", label: "Horses", icon: Heart },
  { value: "exotic", label: "Exotic", icon: Heart },
  { value: "other", label: "Others", icon: Heart },
];

export default function AddPet() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema.omit({ userId: true })),
    defaultValues: {
      name: "",
      category: "",
      breed: "",
      dateOfBirth: "",
      age: undefined,
      microchipId: "",
      birthmarks: "",
      imageUrl: "",
    },
  });

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedImage(dataUrl);
        form.setValue('imageUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    form.setValue('imageUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const createPetMutation = useMutation({
    mutationFn: async (data: Omit<InsertPet, 'userId'>) => {
      await apiRequest("POST", "/api/pets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Success",
        description: "Pet profile created successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertPet, 'userId'>) => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a pet category",
        variant: "destructive",
      });
      return;
    }
    
    createPetMutation.mutate({
      ...data,
      category: selectedCategory,
    });
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={() => setLocation("/")} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Add New Pet</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Category Selection */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">Pet Category</Label>
              <div className="grid grid-cols-3 gap-3">
                {petCategories.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`pet-category-btn ${selectedCategory === value ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(value);
                      form.setValue('category', value);
                    }}
                  >
                    <Icon className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Photo Upload */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">Pet Photo</Label>
              
              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Pet preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={handleCameraCapture}
                    disabled={isUploading}
                    className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Take Photo</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Choose Photo</span>
                  </button>
                </div>
              )}
              
              {isUploading && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500">Processing image...</span>
                </div>
              )}
            </div>

            {/* Pet Details Form */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter breed" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (in months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter age in months" 
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="microchipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Microchip ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter microchip ID" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthmarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthmarks / Remarks</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any distinctive marks or remarks"
                        className="h-24 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-white py-3 font-semibold hover:bg-green-600"
              disabled={createPetMutation.isPending}
            >
              {createPetMutation.isPending ? "Saving..." : "Save Pet Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const checkupTypes = [
  "Annual Physical Exam",
  "Wellness Check",
  "Senior Pet Exam",
  "Puppy/Kitten Check",
  "Pre-Surgery Exam",
  "Follow-up Visit",
  "Emergency Visit",
  "Other"
];

export default function CheckupForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "checkup" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: true,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "cost" as const,
      label: "Visit Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Checkup Record"
      petId={petId}
      recordType="checkup"
      typeOptions={checkupTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const dewormingTypes = [
  "Roundworm Treatment",
  "Hookworm Treatment", 
  "Tapeworm Treatment",
  "Whipworm Treatment",
  "Heartworm Prevention",
  "General Deworming",
  "Other"
];

export default function DewormingForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "deworming" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: true,
    reminderSms: false,
  };

  return (
    <MedicalRecordForm
      title="Add Deworming Record"
      petId={petId}
      recordType="deworming"
      typeOptions={dewormingTypes}
      defaultValues={defaultValues}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EmailConfirmed() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. No token provided.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/confirm-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          toast({
            title: "Email Confirmed",
            description: "Your email has been successfully confirmed!",
          });
        } else {
          setStatus('error');
          setMessage(data.message || 'Email confirmation failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    confirmEmail();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/login")}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
          
          <p className="text-gray-600">
            {status === 'loading' && 'Please wait while we confirm your email address.'}
            {status === 'success' && 'Your email has been successfully verified.'}
            {status === 'error' && 'There was a problem confirming your email.'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <Mail className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/login")} 
                className="w-full"
              >
                Continue to Login
              </Button>
              <p className="text-sm text-gray-600 text-center">
                You can now log in to your ASOPETS account and start managing your pet's health records.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/login")} 
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
              <p className="text-sm text-gray-600 text-center">
                If you continue to have issues, please contact support or try requesting a new confirmation email.
              </p>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                This should only take a moment...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  PieChart,
  Receipt,
  Target,
  Syringe,
  PillBottle,
  Heart as MedicalKit,
  UserCog,
  Stethoscope,
  Filter,
  Download,
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash2
} from "lucide-react";
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, isThisYear, isThisMonth, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/bottom-navigation";
import type { Pet, MedicalRecord } from "@shared/schema";

export default function Expenses() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPet, setFilterPet] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [budgetGoal, setBudgetGoal] = useState(() => {
    const saved = localStorage.getItem('petBudgetGoal');
    return saved ? Number(saved) : 100;
  });
  const [isSettingBudget, setIsSettingBudget] = useState(false);

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('petBudgetGoal', budgetGoal.toString());
  }, [budgetGoal]);

  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets?includePhotos=false&limit=50");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Fetch all medical records for expense calculation
  const allMedicalRecordsQueries = useQuery({
    queryKey: ["/api/medical-records/all"],
    queryFn: async () => {
      const allRecords: MedicalRecord[] = [];
      for (const pet of pets) {
        const response = await fetch(`/api/pets/${pet.id}/medical-records`);
        if (response.ok) {
          const records = await response.json();
          allRecords.push(...records);
        }
      }
      return allRecords;
    },
    enabled: isAuthenticated && pets.length > 0,
  });

  const allMedicalRecords = allMedicalRecordsQueries.data || [];

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      default: return <Receipt {...iconProps} />;
    }
  };

  const parseAmount = (cost: string | null) => {
    if (!cost) return 0;
    const parsed = parseFloat(cost.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const recordsWithCost = allMedicalRecords.filter(record => 
    record.cost && parseAmount(record.cost) > 0
  );

  // Calculate expenses
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const yearlyExpenses = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((sum, record) => sum + parseAmount(record.cost), 0);
  
  const monthlyExpenses = recordsWithCost
    .filter(record => isThisMonth(new Date(record.dateAdministered)))
    .reduce((sum, record) => sum + parseAmount(record.cost), 0);

  // Calculate expenses by category
  const expensesByType = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((acc, record) => {
      const type = record.type;
      acc[type] = (acc[type] || 0) + parseAmount(record.cost);
      return acc;
    }, {} as Record<string, number>);

  // Calculate expenses by pet
  const expensesByPet = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((acc, record) => {
      const pet = pets.find(p => p.id === record.petId);
      const petName = pet?.name || 'Unknown';
      acc[petName] = (acc[petName] || 0) + parseAmount(record.cost);
      return acc;
    }, {} as Record<string, number>);

  // Monthly breakdown for current year
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1);
    const monthExpenses = recordsWithCost
      .filter(record => {
        const recordDate = new Date(record.dateAdministered);
        return recordDate.getFullYear() === currentYear && recordDate.getMonth() === i;
      })
      .reduce((sum, record) => sum + parseAmount(record.cost), 0);
    
    return {
      month: format(month, 'MMM'),
      amount: monthExpenses,
    };
  });

  // Budget tracking
  const monthlyBudget = pets.length * budgetGoal;
  const budgetUsed = monthlyExpenses > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;

  // Filtered and sorted records
  const filteredRecords = recordsWithCost.filter(record => {
    const pet = pets.find(p => p.id === record.petId);
    const petName = pet?.name || '';
    
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.veterinarian && record.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesPet = filterPet === "all" || record.petId.toString() === filterPet;
    
    return matchesSearch && matchesType && matchesPet;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateAdministered).getTime() - new Date(b.dateAdministered).getTime();
        break;
      case 'amount':
        comparison = parseAmount(a.cost) - parseAmount(b.cost);
        break;
      case 'pet':
        const petA = pets.find(p => p.id === a.petId)?.name || '';
        const petB = pets.find(p => p.id === b.petId)?.name || '';
        comparison = petA.localeCompare(petB);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Export function
  const exportToCSV = () => {
    const headers = ['Date', 'Pet', 'Type', 'Title', 'Veterinarian', 'Clinic', 'Cost'];
    const csvData = filteredRecords.map(record => {
      const pet = pets.find(p => p.id === record.petId);
      return [
        format(new Date(record.dateAdministered), 'yyyy-MM-dd'),
        pet?.name || 'Unknown',
        record.type,
        record.title,
        record.veterinarian || '',
        record.clinic || '',
        parseAmount(record.cost).toFixed(2)
      ];
    });
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Expense data has been exported to CSV file.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800';
      case 'deworming': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-amber-100 text-amber-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      case 'lab-test': return 'bg-cyan-100 text-cyan-800';
      case 'grooming': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedTypeExpenses = Object.entries(expensesByType)
    .sort(([,a], [,b]) => b - a);
  
  const sortedPetExpenses = Object.entries(expensesByPet)
    .sort(([,a], [,b]) => b - a);

  if (petsLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Expenses</h1>
            <p className="text-white/80 text-sm">
              {formatCurrency(yearlyExpenses)} spent this year
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={exportToCSV}
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">History</TabsTrigger>
            <TabsTrigger value="breakdown">Analytics</TabsTrigger>
            <TabsTrigger value="budget">Add Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(monthlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="flex items-center justify-center mt-1">
                    <Calendar className="w-3 h-3 text-secondary mr-1" />
                    <span className="text-xs text-secondary">
                      {format(new Date(), 'MMMM')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(yearlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-600">This Year</div>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="w-3 h-3 text-primary mr-1" />
                    <span className="text-xs text-primary">
                      {currentYear}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Receipt className="w-5 h-5 mr-2 text-secondary" />
                  Recent Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsWithCost.length > 0 ? (
                  <div className="space-y-3">
                    {recordsWithCost
                      .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())
                      .slice(0, 5)
                      .map((record) => {
                        const pet = pets.find(p => p.id === record.petId);
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getActivityIcon(record.type)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{record.title}</p>
                                <p className="text-sm text-gray-600">{pet?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(record.dateAdministered), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                {formatCurrency(parseAmount(record.cost))}
                              </div>
                              <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                                {record.type}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">No expenses recorded</p>
                    <p className="text-sm">Add costs to medical records to track expenses</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 mt-6">
            {/* Filter and Search Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Transaction History</h3>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="vaccine">Vaccines</SelectItem>
                          <SelectItem value="deworming">Deworming</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="lab-test">Lab Test</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterPet} onValueChange={setFilterPet}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Pets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pets</SelectItem>
                          {pets.map(pet => (
                            <SelectItem key={pet.id} value={pet.id.toString()}>
                              {pet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="pet">Pet</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
              <CardContent className="p-0">
                {filteredRecords.length > 0 ? (
                  <div className="divide-y">
                    {filteredRecords.map((record) => {
                      const pet = pets.find(p => p.id === record.petId);
                      return (
                        <div key={record.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getActivityIcon(record.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900">{record.title}</p>
                                  <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                                    {record.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{pet?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(record.dateAdministered), 'MMM d, yyyy')}
                                </p>
                                {record.veterinarian && (
                                  <p className="text-xs text-gray-500">Dr. {record.veterinarian}</p>
                                )}
                                {record.clinic && (
                                  <p className="text-xs text-gray-500">{record.clinic}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{formatCurrency(parseAmount(record.cost))}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Summary */}
            {filteredRecords.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {filteredRecords.length}
                      </p>
                      <p className="text-sm text-gray-600">Transactions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(filteredRecords.reduce((sum, record) => sum + parseAmount(record.cost), 0))}
                      </p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4 mt-6">
            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="w-5 h-5 mr-2 text-primary" />
                  By Category ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedTypeExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {sortedTypeExpenses.map(([type, amount]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(type)}
                          </div>
                          <span className="font-medium capitalize">{type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">
                            {yearlyExpenses > 0 ? Math.round((amount / yearlyExpenses) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No category data available</p>
                )}
              </CardContent>
            </Card>

            {/* By Pet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-accent" />
                  By Pet ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedPetExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {sortedPetExpenses.map(([petName, amount]) => (
                      <div key={petName} className="flex items-center justify-between">
                        <span className="font-medium">{petName}</span>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">
                            {yearlyExpenses > 0 ? Math.round((amount / yearlyExpenses) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No pet data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4 mt-6">
            {/* Budget Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-accent" />
                    Budget Settings
                  </div>
                  <Dialog open={isSettingBudget} onOpenChange={setIsSettingBudget}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Monthly Budget</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budget">Monthly Budget per Pet</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={budgetGoal}
                            onChange={(e) => setBudgetGoal(Number(e.target.value))}
                            placeholder="100"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Total monthly budget: {formatCurrency(pets.length * budgetGoal)}
                          </p>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setIsSettingBudget(false);
                            toast({
                              title: "Budget Updated",
                              description: `Monthly budget set to ${formatCurrency(budgetGoal)} per pet`,
                            });
                          }}
                        >
                          Save Budget
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Per Pet</p>
                      <p className="text-lg font-bold">{formatCurrency(budgetGoal)}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded">
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(monthlyBudget)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Spent This Month</span>
                    <span className="font-bold">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Remaining</span>
                    <span className={`font-bold ${monthlyBudget - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlyBudget - monthlyExpenses)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Usage</span>
                      <span>{Math.round(budgetUsed)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(budgetUsed, 100)} 
                      className={`h-3 ${budgetUsed > 90 ? 'bg-red-100' : budgetUsed > 75 ? 'bg-yellow-100' : 'bg-green-100'}`}
                    />
                    {budgetUsed > 100 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        Over budget by {formatCurrency(monthlyExpenses - monthlyBudget)}
                      </div>
                    )}
                    {budgetUsed > 75 && budgetUsed <= 100 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        Approaching budget limit ({Math.round(budgetUsed)}% used)
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending by Pet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="w-5 h-5 mr-2 text-primary" />
                  Pet Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pets.map(pet => {
                    const petExpenses = recordsWithCost
                      .filter(record => record.petId === pet.id && isThisMonth(new Date(record.dateAdministered)))
                      .reduce((sum, record) => sum + parseAmount(record.cost), 0);
                    const petBudgetUsed = petExpenses > 0 ? (petExpenses / budgetGoal) * 100 : 0;
                    
                    return (
                      <div key={pet.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pet.name}</span>
                          <span className="font-bold">{formatCurrency(petExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Budget: {formatCurrency(budgetGoal)}</span>
                          <span>{Math.round(petBudgetUsed)}%</span>
                        </div>
                        <Progress 
                          value={Math.min(petBudgetUsed, 100)} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Monthly Trends ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlyBreakdown.map((month, index) => {
                    const isCurrentMonth = index === currentMonth;
                    return (
                      <div key={month.month} className={`flex justify-between items-center p-2 rounded ${isCurrentMonth ? 'bg-primary/10' : ''}`}>
                        <span className={`font-medium ${isCurrentMonth ? 'text-primary' : ''}`}>
                          {month.month}
                        </span>
                        <span className={`font-bold ${isCurrentMonth ? 'text-primary' : ''}`}>
                          {formatCurrency(month.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation activeTab="expenses" />
    </div>
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", {
        email: data.email,
      });
      
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We've sent password reset instructions to your email address. Please check your email and follow the link to reset your password.
              </p>
              <Button 
                onClick={() => setLocation("/")} 
                variant="outline" 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
            <p className="text-center text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="email"
                            placeholder="Enter your email address" 
                            className="pl-10"
                            {...field} 
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";
import type { InsertMedicalRecord } from "@shared/schema";

export default function GroomingForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const petId = parseInt(params.id || "0");

  const defaultValues: InsertMedicalRecord = {
    petId,
    type: "grooming",
    title: "",
    dateAdministered: new Date().toISOString().split('T')[0],
    description: "",
    cost: "",
    veterinarian: "",
    clinic: ""
  };

  const extraFields = [
    {
      name: "clinic" as keyof InsertMedicalRecord,
      label: "Grooming Salon",
      type: "text" as const,
      placeholder: "Name of grooming salon"
    },
    {
      name: "veterinarian" as keyof InsertMedicalRecord,
      label: "Groomer Name",
      type: "text" as const,
      placeholder: "Professional groomer name"
    },
    {
      name: "description" as keyof InsertMedicalRecord,
      label: "Grooming Details",
      type: "textarea" as const,
      placeholder: "Services provided (bath, nail trim, haircut, ear cleaning, etc.)"
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Grooming Record"
      petId={petId}
      recordType="grooming"
      typeOptions={["Full Grooming", "Bath Only", "Nail Trim", "Ear Cleaning", "Teeth Cleaning", "Flea Treatment", "De-shedding", "Nail Painting"]}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => setLocation(`/pet/${petId}`)}
    />
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const labTestTypes = [
  "Blood Test",
  "Urinalysis",
  "Fecal Examination",
  "Tissue / Skin",
  "Imaging",
  "Rapid Test Kit",
  "Culture",
  "Other"
];

export default function LabTestForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "lab-test" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: false,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "batchNumber" as const,
      label: "Test Reference/ID",
      type: "text" as const,
      placeholder: "Lab reference number or test ID",
    },
    {
      name: "cost" as const,
      label: "Test Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    },
    {
      name: "notes" as const,
      label: "Test Results & Notes",
      type: "textarea" as const,
      placeholder: "Enter test results, reference ranges, and any additional notes",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Lab Test Record"
      petId={petId}
      recordType="lab-test"
      typeOptions={labTestTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Calendar, Bell, Smartphone, Lock } from "lucide-react";
import SMSOTPLogin from "@/components/sms-otp-login";

export default function Landing() {
  const [showSMSLogin, setShowSMSLogin] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSMSLogin = () => {
    setShowSMSLogin(true);
  };

  const handleSMSSuccess = () => {
    window.location.reload();
  };

  if (showSMSLogin) {
    return (
      <SMSOTPLogin 
        onSuccess={handleSMSSuccess}
        onBackToRegular={() => setShowSMSLogin(false)}
      />
    );
  }

  return (
    <div className="mobile-container bg-gray-50">
      <div className="p-6 min-h-screen flex flex-col justify-center">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white text-2xl" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VetBB</h1>
          <p className="text-gray-600">Pet Care Solutions</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Medical Records</h3>
                  <p className="text-sm text-gray-600">Track vaccinations, treatments, and health history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-secondary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Appointment Scheduling</h3>
                  <p className="text-sm text-gray-600">Never miss important vet visits and checkups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Bell className="text-accent w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Reminders</h3>
                  <p className="text-sm text-gray-600">Get notified for vaccines, deworming, and treatments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Options */}
        <div className="space-y-3">
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-3 text-lg font-semibold hover:bg-green-600"
            size="lg"
          >
            <Lock className="w-5 h-5 mr-2" />
            Continue with Replit
          </Button>

          <Button 
            onClick={handleSMSLogin}
            variant="outline"
            className="w-full py-3 text-lg font-semibold border-2"
            size="lg"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Login with SMS
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Choose your preferred secure login method
        </p>
      </div>
    </div>
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Heart,
  Smartphone,
  CheckCircle,
  AlertCircle,
  PawPrint,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [lastEmailAttempt, setLastEmailAttempt] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setShowResendConfirmation(false);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      // Force query invalidation to update auth state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Small delay to ensure auth state updates before redirect
      setTimeout(() => {
        setLocation("/");
      }, 100);
    } catch (error: any) {
      if (error.message?.includes("confirm your email")) {
        setShowResendConfirmation(true);
        setLastEmailAttempt(data.email);
        toast({
          title: "Email confirmation required",
          description: "Please confirm your email before logging in. Click 'Resend Confirmation' if you didn't receive the email.",
          variant: "default",
        });
      } else {
        toast({
          title: "Login failed",
          description:
            error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastEmailAttempt) return;
    
    setIsResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-confirmation", { 
        email: lastEmailAttempt 
      });
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and spam folder for the confirmation email.",
        variant: "default",
      });
      setShowResendConfirmation(false);
    } catch (error: any) {
      if (error.message?.includes("already confirmed")) {
        toast({
          title: "Email already confirmed",
          description: "Your email is already confirmed. You can log in now.",
          variant: "default",
        });
        setShowResendConfirmation(false);
      } else {
        toast({
          title: "Failed to resend",
          description: error.message || "Failed to resend confirmation email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to ASOPETS
          </h1>
          <p className="text-gray-600">Your pet's health companion</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Resend Confirmation Email Section */}
            {showResendConfirmation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 mb-3">
                      Didn't receive the confirmation email? We can send you a new one.
                    </p>
                    <Button
                      onClick={handleResendConfirmation}
                      disabled={isResending}
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      {isResending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Confirmation Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => setLocation("/forgot-password")}
                  className="text-primary font-medium hover:underline"
                >
                  Forgot your password?
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-green-800 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              What you can do with ASOPETS
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Track medical records and vaccinations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Set medication reminders</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Monitor expenses and health insights</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>
                  Generate QR codes and share your pet medical records
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>By signing in, you agree to our terms of service</p>
          <p>Your pet data is securely encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Syringe, PillBottle, Heart as MedicalKit, UserCog, Stethoscope, User, Calendar } from "lucide-react";
import HealthSummaryCard from "@/components/health-summary-card";
import MedicalTimeline from "@/components/medical-timeline";
import QRCodeGenerator from "@/components/qr-code-generator";
import PetEditForm from "@/components/pet-edit-form";
import VetClinics from "@/components/vet-clinics";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

export default function PetProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const petId = parseInt(id || "0");
  
  // Get URL parameters to determine initial tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'records', 'qr', 'info'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Clear the URL parameter after setting the tab
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Also check for URL changes (in case user navigates back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['overview', 'records', 'qr', 'info'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { data: pet, isLoading: petLoading, error: petError } = useQuery<Pet>({
    queryKey: [`/api/pets/${petId}`],
    enabled: !!petId,
  });

  const { data: medicalRecords = [], isLoading: recordsLoading, error: recordsError } = useQuery<MedicalRecord[]>({
    queryKey: [`/api/pets/${petId}/medical-records`],
    enabled: !!petId,
  });



  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: [`/api/pets/${petId}/reminders`],
    enabled: !!petId,
  });

  useEffect(() => {
    if (petError && isUnauthorizedError(petError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [petError, toast]);

  if (petLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pet profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Pet not found</p>
        </div>
      </div>
    );
  }

  const overdueReminders = reminders.filter(r => r.isOverdue);
  const upcomingReminders = reminders.filter(r => !r.isOverdue && !r.isCompleted);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return <Syringe className="w-4 h-4" />;
      case 'deworming': return <PillBottle className="w-4 h-4" />;
      case 'treatment': return <MedicalKit className="w-4 h-4" />;
      case 'surgery': return <UserCog className="w-4 h-4" />;
      case 'checkup': return <Stethoscope className="w-4 h-4" />;
      default: return <Stethoscope className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setLocation("/")} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <p className="text-green-100 text-sm">{pet.breed}</p>
            </div>
          </div>
          {pet.imageUrl && (
            <img 
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="vet-clinics">Vets</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="info">Pet Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Health Summary */}
            <HealthSummaryCard 
              medicalRecords={medicalRecords} 
              reminders={reminders} 
              petId={petId}
              onRecordsClick={() => setActiveTab('records')}
            />
            
            {/* Quick Actions Menu */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Add New Record</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/vaccine`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Syringe className="text-primary w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Vaccines</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/deworming`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <PillBottle className="text-secondary w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Deworming</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/treatment`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MedicalKit className="text-accent w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Treatment</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/surgery`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserCog className="text-destructive w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Surgery</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/checkup`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Stethoscope className="text-purple-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Check Up</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/lab-test`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="text-indigo-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Lab Test</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/grooming`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserCog className="text-pink-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Grooming</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setActiveTab('vet-clinics')}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Stethoscope className="text-teal-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Vet Clinics</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="records" className="mt-6">
            <MedicalTimeline petId={petId} medicalRecords={medicalRecords} />
          </TabsContent>
          
          <TabsContent value="vet-clinics" className="mt-6">
            <VetClinics />
          </TabsContent>
          
          <TabsContent value="qr" className="mt-6 space-y-4">
            <QRCodeGenerator 
              pet={pet} 
              medicalRecords={medicalRecords} 
            />
          </TabsContent>
          
          <TabsContent value="info" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-semibold text-gray-900">Pet Information</h3>
                  </div>
                  {pet && <PetEditForm pet={pet} />}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{pet.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900 capitalize">{pet.category}</p>
                    </div>
                  </div>
                  
                  {pet.breed && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Breed</label>
                      <p className="text-gray-900">{pet.breed}</p>
                    </div>
                  )}
                  
                  {pet.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{formatDate(pet.dateOfBirth)}</p>
                    </div>
                  )}
                  
                  {pet.microchipId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Microchip ID</label>
                      <p className="text-gray-900 font-mono text-sm">{pet.microchipId}</p>
                    </div>
                  )}
                  
                  {pet.birthmarks && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Identifying Marks</label>
                      <p className="text-gray-900">{pet.birthmarks}</p>
                    </div>
                  )}
                  
                  {pet.imageUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Photo</label>
                      <img 
                        src={pet.imageUrl} 
                        alt={pet.name}
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600">ASOPETS - Pet Care Management</p>
            <p className="text-center text-sm text-gray-500">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
              <p className="mb-3">
                ASOPETS collects information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Account information (name, email address)</li>
                <li>Pet information (names, breeds, medical records)</li>
                <li>Veterinary clinic ratings and reviews</li>
                <li>Medical records and health data for your pets</li>
                <li>Photos of your pets and medical documents</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Provide and maintain the ASOPETS service</li>
                <li>Send reminders for pet medical appointments</li>
                <li>Help you track your pet's medical history</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Information Sharing</h2>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Data Security</h2>
              <p className="mb-3">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Encrypted data transmission and storage</li>
                <li>Secure authentication systems</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of communications</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Children's Privacy</h2>
              <p className="mb-3">
                My PetBB is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
              <p className="mb-3">
                If you have questions about this Privacy Policy, please contact us through the app's support section.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  Bell,
  Shield,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  LogOut,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Globe,
  UserCircle,
  ContactRound,
  MessageSquare,
  Send,
} from "lucide-react";
import PhotoUpload from "@/components/photo-upload";
import { format } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredLanguage?: string;
  profileImageUrl?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminders: boolean;
  };
}

const contactSupportSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactSupportData = z.infer<typeof contactSupportSchema>;

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "Philippines",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    preferredLanguage: "en",
    profileImageUrl: "",
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      reminders: true,
    },
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      const userData = user as Record<string, any>;
      setProfileData({
        id: userData?.id || "",
        email: userData?.email || "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
        city: userData?.city || "",
        country: userData?.country || "Philippines",
        dateOfBirth: userData?.dateOfBirth || "",
        emergencyContact: userData?.emergencyContact || "",
        emergencyPhone: userData?.emergencyPhone || "",
        preferredLanguage: userData?.preferredLanguage || "en",
        profileImageUrl: userData?.profileImageUrl || "",
        notificationPreferences: userData?.notificationPreferences || {
          email: true,
          sms: false,
          push: true,
          reminders: true,
        },
      });
    }
  }, [user]);

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
  });

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: isAuthenticated,
  });

  // Fetch all medical records for statistics
  const allMedicalRecordsQueries = useQuery({
    queryKey: ["/api/medical-records/all"],
    queryFn: async () => {
      const allRecords: MedicalRecord[] = [];
      for (const pet of pets) {
        const response = await fetch(`/api/pets/${pet.id}/medical-records`);
        if (response.ok) {
          const records = await response.json();
          allRecords.push(...records);
        }
      }
      return allRecords;
    },
    enabled: isAuthenticated && pets.length > 0,
  });

  const allMedicalRecords = allMedicalRecordsQueries.data || [];

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await fetch("/api/auth/user", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate user statistics
  const totalRecords = allMedicalRecords.length;
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter((r) => r.isCompleted).length;
  const overdueReminders = reminders.filter(
    (r) => r.isOverdue && !r.isCompleted,
  ).length;

  // Calculate total expenses
  const totalExpenses = allMedicalRecords
    .filter((record) => record.cost && !isNaN(parseFloat(record.cost)))
    .reduce((sum, record) => sum + parseFloat(record.cost!), 0);

  // Calculate account age based on user registration date
  const calculateAccountAge = () => {
    const userData = user as any;
    if (!userData?.createdAt) return "New member";

    const registrationDate = new Date(userData.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - registrationDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      const remainingMonths = Math.floor((diffInDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? "s" : ""}`;
      } else {
        return `${years}y ${remainingMonths}m`;
      }
    }
  };

  const accountAge = calculateAccountAge();

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "Redirecting to login page...",
    });
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 1000);
  };

  const handleExportData = () => {
    const exportData = {
      pets,
      medicalRecords: allMedicalRecords,
      reminders,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `pet-care-data-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your pet care data has been downloaded.",
    });
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);

          // Validate the data structure
          if (!data.pets || !Array.isArray(data.pets)) {
            throw new Error("Invalid data format");
          }

          toast({
            title: "Import successful",
            description: `Found ${data.pets.length} pets, ${data.medicalRecords?.length || 0} medical records, and ${data.reminders?.length || 0} reminders.`,
          });

          // Here you would typically upload this data to your server
          console.log("Imported data:", data);
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleSaveProfile = async () => {
    try {
      // Filter out empty strings and null values
      const cleanData = Object.fromEntries(
        Object.entries({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          address: profileData.address,
          emergencyContact: profileData.emergencyContact,
          emergencyPhone: profileData.emergencyPhone,
          profileImageUrl: profileData.profileImageUrl,
        }).filter(
          ([key, value]) =>
            value !== "" && value !== null && value !== undefined,
        ),
      );

      await updateProfileMutation.mutateAsync(cleanData);
      setIsEditingProfile(false);
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [type]: value,
      },
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container mobile-safe pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-6 h-6 mr-3" />
            <div>
              <h1 className="text-xl font-bold">Profile</h1>
              <p className="text-white/80 text-sm">Account & Settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleExportData}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profileData.profileImageUrl ? (
                  <img
                    src={profileData.profileImageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                {isEditingProfile && (
                  <div className="absolute -bottom-1 -right-1">
                    <PhotoUpload
                      onPhotoUploaded={(url: string) =>
                        handleInputChange("profileImageUrl", url)
                      }
                      currentPhoto={profileData.profileImageUrl}
                      className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : profileData.firstName || "Pet Owner"}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {profileData.email || "Not available"}
                  </span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                )}
                {profileData.city && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {profileData.city}, {profileData.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Member since {accountAge}</span>
                </div>
                <Button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {isEditingProfile ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Editing Form */}
        {isEditingProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <PhotoUpload
                  onPhotoUploaded={(url: string) =>
                    handleInputChange("profileImageUrl", url)
                  }
                  currentPhoto={profileData.profileImageUrl}
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {pets.length}
                </div>
                <div className="text-sm text-gray-600">Pets Registered</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {totalRecords}
                </div>
                <div className="text-sm text-gray-600">Medical Records</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {totalReminders}
                </div>
                <div className="text-sm text-gray-600">Total Reminders</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {completedReminders}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {overdueReminders > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center text-destructive">
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {overdueReminders} overdue reminder
                    {overdueReminders !== 1 ? "s" : ""} need attention
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-primary" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total Pet Care Expenses
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average per pet:{" "}
                {formatCurrency(
                  pets.length > 0 ? totalExpenses / pets.length : 0,
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showContactForm ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Need help? Have questions about your pet care management? 
                  Our support team is here to assist you.
                </p>
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            ) : (
              <ContactSupportForm 
                userEmail={profileData.email || (user as any)?.email || ""}
                userName={`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim() || "Pet Owner"}
                onSuccess={() => {
                  setShowContactForm(false);
                  toast({
                    title: "Message sent",
                    description: "Your support request has been sent successfully. We'll get back to you soon!",
                  });
                }}
                onCancel={() => setShowContactForm(false)}
              />
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleImportData}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>

            <Separator />

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}

interface ContactSupportFormProps {
  userEmail: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function ContactSupportForm({ userEmail, userName, onSuccess, onCancel }: ContactSupportFormProps) {
  const { toast } = useToast();
  const form = useForm<ContactSupportData>({
    resolver: zodResolver(contactSupportSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const submitSupportRequest = useMutation({
    mutationFn: async (data: ContactSupportData) => {
      await apiRequest("POST", "/api/support/contact", {
        ...data,
        userEmail,
        userName,
      });
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactSupportData) => {
    submitSupportRequest.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of your issue"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your issue in detail. Include any error messages or steps you've taken."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={submitSupportRequest.isPending}
            className="flex-1"
          >
            {submitSupportRequest.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitSupportRequest.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 2000);
    }
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", {
        token,
        password: data.password,
      });
      setIsSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
      setTimeout(() => setLocation("/login"), 3000);
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password. The link may have expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Password Updated!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your password has been successfully updated. You will be redirected to the login page.
            </p>
            <Button onClick={() => setLocation("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/login")}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <p className="text-gray-600">Enter your new password below</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>

          <div className="mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your new password must be at least 8 characters long and should be unique for security.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Bell,
  Syringe,
  PillBottle,
  Heart as MedicalKit,
  UserCog,
  Stethoscope,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Reminder, Pet as PetType } from "@shared/schema";
import { Label } from "@/components/ui/label";

export default function Schedule() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPet, setSelectedPet] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "type" | "pet">("date");

  const { data: reminders = [], isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: isAuthenticated,
  });

  const { data: pets = [] } = useQuery<PetType[]>({
    queryKey: ["/api/pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets?includePhotos=false&limit=50");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: number) => {
      await apiRequest("PUT", `/api/reminders/${reminderId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/overdue"] });
      toast({
        title: "Reminder completed",
        description: "The reminder has been marked as completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'grooming': return <UserCog {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const getPetName = (petId: number) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || 'Unknown Pet';
  };

  const getDateCategory = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const daysDiff = differenceInDays(date, now);

    if (daysDiff < 0) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isThisWeek(date)) return 'this-week';
    if (daysDiff <= 30) return 'this-month';
    return 'later';
  };

  const formatDateDisplay = (dueDate: string, category: string) => {
    const date = new Date(dueDate);
    switch (category) {
      case 'overdue':
        const daysOverdue = Math.abs(differenceInDays(date, new Date()));
        return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;
      case 'today':
        return 'Today';
      case 'tomorrow':
        return 'Tomorrow';
      case 'this-week':
        return format(date, 'EEEE');
      default:
        return format(date, 'MMM d, yyyy');
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'overdue': return 'destructive';
      case 'today': return 'destructive';
      case 'tomorrow': return 'default';
      case 'this-week': return 'secondary';
      default: return 'outline';
    }
  };

  const categorizeReminders = (reminderList: Reminder[]) => {
    const categories = {
      overdue: [] as Reminder[],
      today: [] as Reminder[],
      tomorrow: [] as Reminder[],
      'this-week': [] as Reminder[],
      'this-month': [] as Reminder[],
      later: [] as Reminder[]
    };

    reminderList
      .filter(reminder => reminder.dueDate)
      .forEach(reminder => {
        const category = getDateCategory(reminder.dueDate!);
        categories[category].push(reminder);
      });

    return categories;
  };

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted && pets.some(pet => pet.id === r.petId));

  // Filter and sort reminders
  const filteredUpcomingReminders = useMemo(() => {
    let filtered = activeReminders;

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }

    // Apply pet filter
    if (selectedPet !== "all") {
      filtered = filtered.filter(reminder => reminder.petId.toString() === selectedPet);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type);
        case "pet":
          const petA = pets.find(p => p.id === a.petId)?.name || "";
          const petB = pets.find(p => p.id === b.petId)?.name || "";
          return petA.localeCompare(petB);
        case "date":
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return filtered;
  }, [activeReminders, selectedType, selectedPet, sortBy, pets]);

  const filteredCompletedReminders = useMemo(() => {
    let filtered = completedReminders;

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }

    // Apply pet filter
    if (selectedPet !== "all") {
      filtered = filtered.filter(reminder => reminder.petId.toString() === selectedPet);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type);
        case "pet":
          const petA = pets.find(p => p.id === a.petId)?.name || "";
          const petB = pets.find(p => p.id === b.petId)?.name || "";
          return petA.localeCompare(petB);
        case "date":
        default:
          // For completed reminders, sort by completion date descending
          if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
          }
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
    });

    return filtered;
  }, [completedReminders, selectedType, selectedPet, sortBy, pets]);

  const categorizedReminders = categorizeReminders(filteredUpcomingReminders);

  const handleCompleteReminder = (reminderId: number) => {
    completeReminderMutation.mutate(reminderId);
  };

  if (remindersLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Schedule</h1>
            <p className="text-white/80 text-sm">Manage Reminders</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
            >
              <Bell className="w-5 h-5" />
              {(filteredUpcomingReminders.length + filteredCompletedReminders.length) > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {(filteredUpcomingReminders.length + filteredCompletedReminders.length) > 9 ? '9+' : (filteredUpcomingReminders.length + filteredCompletedReminders.length)}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">

        {/* Filter Controls - Moved above tabs */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Filter & Sort</h3>
              {(selectedType !== "all" || selectedPet !== "all" || sortBy !== "date") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedPet("all");
                    setSortBy("date");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Type Filter */}
              <div>
                <Label className="text-xs text-gray-600">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="vaccine">Vaccine</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pet Filter */}
              <div>
                <Label className="text-xs text-gray-600">Pet</Label>
                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All pets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pets</SelectItem>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="text-xs text-gray-600">Sort by</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "type" | "pet")}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Due Date</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="pet">Pet Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "completed")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {/* Critical Alerts */}
            {categorizedReminders.overdue.length > 0 && (
              <Card className="border-destructive bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Overdue ({categorizedReminders.overdue.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categorizedReminders.overdue.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(reminder.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <p className="text-xs text-destructive font-medium">
                            {formatDateDisplay(reminder.dueDate!, 'overdue')}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteReminder(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Today's Reminders */}
            {categorizedReminders.today.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-amber-800">
                    <Clock className="w-5 h-5 mr-2" />
                    Today ({categorizedReminders.today.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categorizedReminders.today.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(reminder.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <Badge variant="destructive" className="text-xs">Today</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteReminder(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Reminders */}
            {['tomorrow', 'this-week', 'this-month', 'later'].map(category => {
              const categoryReminders = categorizedReminders[category as keyof typeof categorizedReminders];
              if (categoryReminders.length === 0) return null;

              const categoryTitles = {
                tomorrow: 'Tomorrow',
                'this-week': 'This Week',
                'this-month': 'This Month',
                later: 'Later'
              };

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-gray-900">
                      <Bell className="w-5 h-5 mr-2" />
                      {categoryTitles[category as keyof typeof categoryTitles]} ({categoryReminders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(reminder.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reminder.title}</p>
                            <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                            <Badge variant={getBadgeVariant(category)} className="text-xs">
                              {formatDateDisplay(reminder.dueDate!, category)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteReminder(reminder.id)}
                          disabled={completeReminderMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            {activeReminders.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">No upcoming reminders</h3>
                  <p className="text-gray-500 text-sm">
                    All caught up! Add medical records to create new reminders.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {filteredCompletedReminders.length > 0 ? (
              <div className="space-y-3">
                {filteredCompletedReminders.map((reminder: Reminder) => (
                  <Card key={reminder.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <div className="space-y-1">
                            <Badge className="text-xs bg-success text-success-foreground">Completed</Badge>
                            {reminder.completedAt && (
                              <p className="text-xs text-gray-500">
                                Completed: {format(new Date(reminder.completedAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">No completed reminders</h3>
                  <p className="text-gray-500 text-sm">
                    Completed reminders will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="schedule" />
    </div>
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  PawPrint,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      setEmailSent(true);
      toast({
        title: "Account created successfully",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
              <p className="text-gray-600">
                We've sent a confirmation link to your email address. Please click the link to activate your account.
              </p>
              <Button 
                onClick={() => setLocation("/")} 
                variant="outline" 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join ASOPETS</h1>
          <p className="text-gray-600">Create your pet care account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="john@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setLocation("/")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const surgeryTypes = [
  "Spay/Neuter",
  "Dental Surgery",
  "Growth/Tumor Removal",
  "Orthopedic Surgery",
  "Emergency Surgery",
  "Eye Surgery",
  "Other"
];

export default function SurgeryForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "surgery" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: false, // Surgery typically doesn't need reminders
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "cost" as const,
      label: "Surgery Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Surgery Record"
      petId={petId}
      recordType="surgery"
      typeOptions={surgeryTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600">ASOPETS - Pet Care Management</p>
            <p className="text-center text-sm text-gray-500">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Acceptance of Terms</h2>
              <p className="mb-3">
                By accessing and using ASOPETS, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Description of Service</h2>
              <p className="mb-3">
                ASOPETS is a pet care management application that helps users:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Track pet medical records and vaccinations</li>
                <li>Schedule and manage medical reminders</li>
                <li>Monitor pet expenses and budgets</li>
                <li>Find and rate veterinary clinics</li>
                <li>Store pet photos and health documentation</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">User Responsibilities</h2>
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Not attempt to interfere with the service's operation</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Medical Disclaimer</h2>
              <p className="mb-3">
                <strong>Important:</strong> ASOPETS is a pet care management tool and does not provide medical advice. 
                The information stored and managed through this app should not replace professional veterinary care. 
                Always consult with qualified veterinarians for medical decisions regarding your pets.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Data Ownership</h2>
              <p className="mb-3">
                You retain ownership of all data you input into ASOPETS, including pet information, medical records, 
                and photos. We provide tools to export your data at any time.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Service Availability</h2>
              <p className="mb-3">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We may perform maintenance, updates, or modifications that temporarily affect service availability.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Limitation of Liability</h2>
              <p className="mb-3">
                ASOPETS shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of the service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Account Termination</h2>
              <p className="mb-3">
                You may terminate your account at any time. We reserve the right to suspend or terminate accounts 
                that violate these terms of service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Changes to Terms</h2>
              <p className="mb-3">
                We may update these terms from time to time. Users will be notified of significant changes, 
                and continued use of the service constitutes acceptance of updated terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
              <p className="mb-3">
                For questions about these Terms of Service, please contact us through the app's support section.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const treatmentTypes = [
  "Flea Treatment",
  "Tick Treatment",
  "Ear Infection Treatment",
  "Skin Condition Treatment",
  "Antibiotic Course",
  "Pain Management",
  "Allergy Treatment",
  "Other"
];

export default function TreatmentForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "treatment" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: true,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "cost" as const,
      label: "Treatment Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Treatment Record"
      petId={petId}
      recordType="treatment"
      typeOptions={treatmentTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { useParams, useLocation } from "wouter";
import { insertMedicalRecordSchema } from "@shared/schema";
import MedicalRecordForm from "@/components/medical-record-form";

const vaccineTypes = [
  "Rabies",
  "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
  "Bordetella",
  "Lyme Disease",
  "Canine Influenza",
  "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
  "FeLV (Feline Leukemia)",
  "Other"
];

export default function VaccineForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "vaccine" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: true,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "batchNumber" as const,
      label: "Batch/Lot Number",
      type: "text" as const,
      placeholder: "Enter batch number",
    },
    {
      name: "weight" as const,
      label: "Pet Weight (kg)",
      type: "text" as const,
      placeholder: "Enter weight in kg",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Vaccination Record"
      petId={petId}
      recordType="vaccine"
      typeOptions={vaccineTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Calendar, DollarSign, MapPin, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Medical Records",
    description: "Track vaccinations, treatments, and health history for all your pets"
  },
  {
    icon: Calendar,
    title: "Smart Reminders",
    description: "Never miss important medical appointments or medication schedules"
  },
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description: "Monitor pet care costs and set budgets for different categories"
  },
  {
    icon: MapPin,
    title: "Find Vet Clinics",
    description: "Discover nearby veterinary clinics and read reviews from other pet owners"
  }
];

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const steps = [
    {
      title: "Welcome to ASOPETS",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Pet's Health Companion</h2>
            <p className="text-gray-600">
              Comprehensive pet care management made simple. Track medical records, 
              schedule reminders, and keep your furry friends healthy and happy.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Everything you need for pet care</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Get Started",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first pet to begin tracking their health and care.
            </p>
            <Button 
              onClick={() => setLocation("/add-pet")} 
              className="w-full"
              size="lg"
            >
              Add Your First Pet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setLocation("/");
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <div className="flex space-x-2 justify-center mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.content}
            
            {currentStep < steps.length - 1 && (
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Calendar, Syringe, BarChart3, MapPin, QrCode } from "lucide-react";
import { PageLoader } from "@/components/loading-spinner";
import PetCard from "@/components/pet-card";
import DashboardInsights from "@/components/dashboard-insights";
import OfflineSyncIndicator from "@/components/offline-sync-indicator";
import BottomNavigation from "@/components/bottom-navigation";
import QuickActions from "@/components/quick-actions";
import VetClinics from "@/components/vet-clinics";
import QRScanner from "@/components/qr-scanner";
import ScannedPetViewer from "@/components/scanned-pet-viewer";
import type { Pet, Reminder, MedicalRecord } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showVetClinics, setShowVetClinics] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedPetData, setScannedPetData] = useState<any>(null);

  const handleQRScanSuccess = async (data: any) => {
    try {
      const response = await fetch(`/api/pets/public/${data.petId}`);
      if (!response.ok) {
        throw new Error('Pet not found or access denied');
      }
      
      const petData = await response.json();
      setScannedPetData(petData);
      
      setTimeout(() => {
        setShowQRScanner(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching pet data:', error);
      toast({
        title: "Error",
        description: "Could not load pet information. The pet may not exist or access is restricted.",
        variant: "destructive",
      });
      setShowQRScanner(false);
    }
  };

  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/";
      return;
    }
  }, [isAuthenticated, isLoading]);

  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets?includePhotos=false&limit=20");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
    enabled: !!user,
  });

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: !!user,
  });

  const { data: overdueReminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders/overdue"],
    enabled: !!user,
  });

  // Fetch all medical records for insights
  const allMedicalRecordsQueries = useQuery({
    queryKey: ["/api/medical-records/all"],
    queryFn: async () => {
      const allRecords: MedicalRecord[] = [];
      for (const pet of pets) {
        const response = await fetch(`/api/pets/${pet.id}/medical-records`);
        if (response.ok) {
          const records = await response.json();
          allRecords.push(...records);
        }
      }
      return allRecords;
    },
    enabled: !!user && pets.length > 0,
  });

  const allMedicalRecords = allMedicalRecordsQueries.data || [];

  if (isLoading || petsLoading) {
    return <PageLoader />;
  }

  const totalNotifications = overdueReminders.length;

  return (
    <div className="mobile-container mobile-safe">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <p className="text-white/80 text-sm">
              Managing {pets.length} pet{pets.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setShowQRScanner(true)}
            >
              <QrCode className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
              onClick={() => setLocation("/schedule")}
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 pb-20">
        {/* Offline Sync Indicator */}
        <OfflineSyncIndicator />

        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pets">My Pets</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-6 mt-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Pets</h2>
            </div>
            {/* Pet Grid */}
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  reminders={reminders.filter((r) => r.petId === pet.id)}
                />
              ))}
              {/* Add Pet Card */}

              <div
                className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => setLocation("/add-pet")}
              >
                <Plus className="text-gray-400 text-2xl mb-2" />
                <p className="text-gray-500 text-sm font-medium">Add Pet</p>
              </div>
            </div>
            {/* Quick Actions */}
            <QuickActions onFindClinics={() => setShowVetClinics(true)} />

            {/* Overdue Reminders Alert */}
            {overdueReminders.length > 0 && (
              <Card className="border-destructive bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Bell className="text-destructive mr-2 w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">
                      Overdue Reminders
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {overdueReminders.slice(0, 3).map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">
                          {reminder.title}
                        </span>
                        <span className="status-badge overdue">Overdue</span>
                      </div>
                    ))}
                    {overdueReminders.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{overdueReminders.length - 3} more overdue items
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <DashboardInsights
              pets={pets}
              allMedicalRecords={allMedicalRecords}
              reminders={reminders}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Find Vet Clinics Modal */}
      {showVetClinics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
          <div className="bg-white rounded-lg m-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Find Vet Clinics</h2>
              <button
                onClick={() => setShowVetClinics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <VetClinics />
            </div>
          </div>
        </div>
      )}

      {showQRScanner && (
        <QRScanner 
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={(data) => {
            setShowQRScanner(false);
            if (data.type === "pet-profile") {
              setScannedPetData(data);
              
              // Store scanned pet data for display
              
              toast({
                title: "Pet Profile Scanned",
                description: `Successfully scanned ${data.name}'s profile!`,
              });
            }
          }}
        />
      )}

      {scannedPetData && (
        <ScannedPetViewer 
          data={scannedPetData}
          onClose={() => setScannedPetData(null)}
        />
      )}

      <BottomNavigation activeTab="home" />
    </div>
  );
}
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoader } from "@/components/loading-spinner";
import { OfflineIndicator } from "@/components/offline-indicator";
import MedicationReminderManager from "@/components/medication-reminder-manager";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Expenses from "@/pages/expenses";
import Profile from "@/pages/profile";
import AddPet from "@/pages/add-pet";
import PetProfile from "@/pages/pet-profile";
import VaccineForm from "@/pages/vaccine-form";
import DewormingForm from "@/pages/deworming-form";
import TreatmentForm from "@/pages/treatment-form";
import SurgeryForm from "@/pages/surgery-form";
import CheckupForm from "@/pages/checkup-form";
import LabTestForm from "@/pages/lab-test-form";
import GroomingForm from "@/pages/grooming-form";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Welcome from "@/pages/welcome";
import ResetPassword from "@/pages/reset-password";
import ForgotPassword from "@/pages/forgot-password";
import EmailConfirmed from "@/pages/email-confirmed";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/email-confirmed" component={EmailConfirmed} />
          <Route path="/landing" component={Landing} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/profile" component={Profile} />
          <Route path="/add-pet" component={AddPet} />
          <Route path="/pet/:id" component={PetProfile} />
          <Route path="/pet/:id/vaccine" component={VaccineForm} />
          <Route path="/pet/:id/deworming" component={DewormingForm} />
          <Route path="/pet/:id/treatment" component={TreatmentForm} />
          <Route path="/pet/:id/surgery" component={SurgeryForm} />
          <Route path="/pet/:id/checkup" component={CheckupForm} />
          <Route path="/pet/:id/lab-test" component={LabTestForm} />
          <Route path="/pet/:id/grooming" component={GroomingForm} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <OfflineIndicator />
        <Toaster />
        <Router />
        <MedicationReminderManager />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
