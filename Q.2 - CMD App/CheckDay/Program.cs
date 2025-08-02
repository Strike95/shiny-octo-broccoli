using System;

class Program
{
    private static readonly Random random = new Random();
    private static readonly string[] WeekdayNames = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

    static void Main(string[] args)
    {
        try
        {
            // Check for random test mode
            if (args.Length > 0 && args[0].ToLower() == "random")
            {
                RunRandomTests(args);
                return;
            }

            if (args.Length != 2)
            {
                Console.WriteLine("Usage: CheckDay <year> <weekday>");
                Console.WriteLine("       CheckDay random [count] - Run random tests (default: 5)");
                Console.WriteLine("Weekday: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday");
                return;
            }

            if (!int.TryParse(args[0], out int year))
            {
                Console.WriteLine("Error: Year must be a valid integer.");
                return;
            }

            // Additional check on year parsing - ensure it's a reasonable year
            if (year < 1900 || year > 9999)
            {
                Console.WriteLine("Error: Year must be between 1900 and 9999.");
                return;
            }

            if (!int.TryParse(args[1], out int weekdayInput))
            {
                Console.WriteLine("Error: Weekday must be a valid integer.");
                return;
            }

            if (!TryParseWeekdayFromInt(weekdayInput, out DayOfWeek targetWeekday))
            {
                Console.WriteLine("Error: Invalid weekday. Use 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday.");
                return;
            }

            int count = CountWeekdayOnFirstOfMonth(year, targetWeekday);
            Console.WriteLine($"In {year}, the first of the month fell on a {targetWeekday} {count} time(s).");
        }
        catch (OutOfMemoryException)
        {
            Console.WriteLine("Error: The application ran out of memory. Please try with a smaller year range.");
            Environment.Exit(1);
        }
        catch (OverflowException ex)
        {
            Console.WriteLine($"Error: Numerical overflow occurred during calculation. {ex.Message}");
            Environment.Exit(1);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Error: Invalid argument provided. {ex.Message}");
            Environment.Exit(1);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: An unexpected error occurred. {ex.Message}");
            Console.WriteLine("Please check your input parameters and try again.");
            Environment.Exit(1);
        }
    }

    static void RunRandomTests(string[] args)
    {
        try
        {
            int testCount = 5; // default
            if (args.Length > 1 && int.TryParse(args[1], out int count) && count > 0)
            {
                testCount = count;
            }

            // Additional validation for random test count
            if (testCount > 1000)
            {
                Console.WriteLine("Warning: Large number of tests requested. Limiting to 1000 tests for performance.");
                testCount = 1000;
            }

            Console.WriteLine($"=== CheckDay Random Test Mode ===");
            Console.WriteLine($"Running {testCount} random test cases...");
            Console.WriteLine();

            for (int i = 1; i <= testCount; i++)
            {
                int year = GenerateRandomYear();
                int weekday = GenerateRandomWeekday();
                
                Console.WriteLine($"Random Test {i}: Year {year}, {WeekdayNames[weekday]} ({weekday})");
                int result = CountWeekdayOnFirstOfMonth(year, (DayOfWeek)weekday);
                Console.WriteLine($"Result: In {year}, the first of the month fell on a {(DayOfWeek)weekday} {result} time(s).");
                Console.WriteLine();
            }

            Console.WriteLine("=== Random Test Mode Completed ===");
        }
        catch (OutOfMemoryException)
        {
            Console.WriteLine("Error: The application ran out of memory during random testing. Please try with fewer tests.");
            Environment.Exit(1);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            Console.WriteLine($"Error: Random number generation failed. {ex.Message}");
            Environment.Exit(1);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: An unexpected error occurred during random testing. {ex.Message}");
            Environment.Exit(1);
        }
    }

    static int GenerateRandomYear()
    {
        try
        {
            // Generate year between 1900 and 2100
            return random.Next(1900, 2101);
        }
        catch (ArgumentOutOfRangeException)
        {
            // Fallback to a safe default
            Console.WriteLine("Warning: Random year generation failed, using default year 2000.");
            return 2000;
        }
    }

    static int GenerateRandomWeekday()
    {
        try
        {
            // Generate weekday between 0 and 6
            return random.Next(0, 7);
        }
        catch (ArgumentOutOfRangeException)
        {
            // Fallback to a safe default
            Console.WriteLine("Warning: Random weekday generation failed, using default weekday 0 (Sunday).");
            return 0;
        }
    }

    static bool TryParseWeekdayFromInt(int input, out DayOfWeek weekday)
    {
        try
        {
            if (input >= 0 && input <= 6)
            {
                weekday = (DayOfWeek)input;
                return true;
            }
            weekday = DayOfWeek.Sunday;
            return false;
        }
        catch (Exception)
        {
            weekday = DayOfWeek.Sunday;
            return false;
        }
    }

    static int CountWeekdayOnFirstOfMonth(int year, DayOfWeek targetWeekday)
    {
        try
        {
            int count = 0;
            
            for (int month = 1; month <= 12; month++)
            {
                DayOfWeek firstDayOfMonth = GetDayOfWeek(year, month, 1);
                if (firstDayOfMonth == targetWeekday)
                {
                    count++;
                }
            }
            
            return count;
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException($"Error calculating weekday occurrences for year {year}: {ex.Message}");
        }
        catch (OverflowException ex)
        {
            throw new OverflowException($"Numerical overflow while calculating for year {year}: {ex.Message}");
        }
    }

    static DayOfWeek GetDayOfWeek(int year, int month, int day)
    {
        try
        {
            // Calculate days since 1 Jan 1900 (which was a Monday)
            int totalDays = CalculateDaysSince1900(year, month, day);
            
            // 1 Jan 1900 was a Monday (DayOfWeek.Monday = 1)
            // We need to adjust since our calculation gives us days since Monday
            int dayOfWeekIndex = (totalDays + 1) % 7; // +1 because 1 Jan 1900 was Monday (index 1)
            
            return (DayOfWeek)dayOfWeekIndex;
        }
        catch (OverflowException ex)
        {
            throw new OverflowException($"Date calculation overflow for {year}-{month:D2}-{day:D2}: {ex.Message}");
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException($"Invalid date parameters: year={year}, month={month}, day={day}. {ex.Message}");
        }
    }

    static int CalculateDaysSince1900(int year, int month, int day)
    {
        try
        {
            int totalDays = 0;
            
            // Add days for complete years from 1900 to year-1
            for (int y = 1900; y < year; y++)
            {
                totalDays = checked(totalDays + (IsLeapYear(y) ? 366 : 365));
            }
            
            // Add days for complete months in the target year
            for (int m = 1; m < month; m++)
            {
                totalDays = checked(totalDays + GetDaysInMonth(year, m));
            }
            
            // Add the remaining days (day - 1 because we're counting from day 1)
            totalDays = checked(totalDays + day - 1);
            
            return totalDays;
        }
        catch (OverflowException)
        {
            throw new OverflowException($"Integer overflow while calculating days since 1900 for date {year}-{month:D2}-{day:D2}");
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException($"Invalid date calculation parameters: {ex.Message}");
        }
    }

    static bool IsLeapYear(int year)
    {
        try
        {
            // A leap year occurs on any year evenly divisible by 4, 
            // but not on a century unless it is divisible by 400
            if (year % 400 == 0) return true;
            if (year % 100 == 0) return false;
            if (year % 4 == 0) return true;
            return false;
        }
        catch (DivideByZeroException)
        {
            // This should never happen with literal divisors, but included for completeness
            return false;
        }
    }

    static int GetDaysInMonth(int year, int month)
    {
        try
        {
            return month switch
            {
                1 => 31,  // January
                2 => IsLeapYear(year) ? 29 : 28,  // February
                3 => 31,  // March
                4 => 30,  // April
                5 => 31,  // May
                6 => 30,  // June
                7 => 31,  // July
                8 => 31,  // August
                9 => 30,  // September
                10 => 31, // October
                11 => 30, // November
                12 => 31, // December
                _ => throw new ArgumentException($"Invalid month: {month}. Month must be between 1 and 12.")
            };
        }
        catch (Exception ex) when (!(ex is ArgumentException))
        {
            throw new ArgumentException($"Error calculating days in month {month} for year {year}: {ex.Message}");
        }
    }
}
