"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDatePicker, DatePickerProvider, Navigation, MonthTable, Day, WeekDays, Calendar as RehookifyCalendar } from "@rehookify/datepicker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = {
  className?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
}

function Calendar({ className, value, onChange }: CalendarProps) {
  const [selected, setSelected] = React.useState<Date | null>(value ?? null)
  const datePicker = useDatePicker({
    selected: selected ? [selected] : [],
    onDatesChange: (dates) => {
      const date = dates[0] ?? null
      setSelected(date)
      onChange?.(date)
    },
    calendar: {
      months: 1,
    },
  })

  return (
    <DatePickerProvider {...datePicker}>
      <div className={cn("p-3", className)}>
        <div className="flex justify-center pt-1 relative items-center">
          <Navigation
            prevButtonProps={{
              className: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
              ),
              children: <ChevronLeft className="h-4 w-4" />,
            }}
            nextButtonProps={{
              className: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
              ),
              children: <ChevronRight className="h-4 w-4" />,
            }}
          />
          <span className="text-sm font-medium">
            <RehookifyCalendar.MonthLabel />
          </span>
        </div>
        <div className="space-y-4">
          <div className="w-full border-collapse space-y-1">
            <WeekDays className="flex" weekdayClassName="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" />
            <MonthTable
              className="flex w-full mt-2"
              weekClassName="flex w-full mt-2"
              dayClassName={({ selected, today, outside, disabled }) =>
                cn(
                  "h-9 w-9 text-center text-sm p-0 relative",
                  selected &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  today && "bg-accent text-accent-foreground",
                  outside && "text-muted-foreground opacity-50",
                  disabled && "text-muted-foreground opacity-50",
                  buttonVariants({ variant: "ghost" }),
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                )
              }
              dayComponent={Day}
            />
          </div>
        </div>
      </div>
    </DatePickerProvider>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
