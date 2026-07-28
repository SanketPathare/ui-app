using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

public partial class CSharpBridge
{
    private static readonly List<PortableExecutableReference> _references = new();
    private static bool _initialized;

    public static void Initialize()
    {
        if (_initialized) return;
        _initialized = true;

        var assemblies = new[]
        {
            typeof(object).Assembly,
            typeof(Console).Assembly,
            typeof(Enumerable).Assembly,
            typeof(ValueTuple).Assembly,
            typeof(Uri).Assembly,
            typeof(System.Text.Json.JsonSerializer).Assembly,
            typeof(System.Net.Http.HttpClient).Assembly,
            typeof(System.Threading.Tasks.Task).Assembly,
            typeof(System.Threading.Tasks.ValueTask).Assembly,
            typeof(System.Collections.Generic.List<>).Assembly,
            typeof(System.Linq.Expressions.Expression).Assembly,
        };

        var seen = new HashSet<string>();
        foreach (var asm in assemblies)
        {
            var location = asm.Location;
            if (string.IsNullOrEmpty(location) || !seen.Add(location)) continue;
            if (File.Exists(location))
            {
                _references.Add(MetadataReference.CreateFromFile(location));
            }
        }

        foreach (var asmName in new[]
        {
            "System.Runtime",
            "System.Console",
            "System.Linq",
            "System.Collections",
            "System.Threading.Tasks",
            "System.Text.Json",
            "System.Net.Http",
            "System.Text.RegularExpressions",
            "System.IO",
            "System.Private.CoreLib",
        })
        {
            var asm = Assembly.Load(new AssemblyName(asmName));
            if (asm != null && !string.IsNullOrEmpty(asm.Location) && seen.Add(asm.Location))
            {
                _references.Add(MetadataReference.CreateFromFile(asm.Location));
            }
        }
    }

    [JSExport]
    public static string CompileAndRun(string sourceCode, int timeoutMs)
    {
        Initialize();

        var stdoutWriter = new StringWriter();
        var stderrWriter = new StringWriter();
        var originalOut = Console.Out;
        var originalError = Console.Error;

        try
        {
            Console.SetOut(stdoutWriter);
            Console.SetError(stderrWriter);

            var tree = CSharpSyntaxTree.ParseText(sourceCode,
                CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest));

            var options = new CSharpCompilationOptions(OutputKind.ConsoleApplication)
                .WithOptimizationLevel(OptimizationLevel.Debug)
                .WithAllowUnsafe(true)
                .WithPlatform(Platform.AnyCpu);

            var compilation = CSharpCompilation.Create("UserCode",
                new[] { tree },
                _references,
                options);

            using var ms = new MemoryStream();
            var emitResult = compilation.Emit(ms);

            if (!emitResult.Success)
            {
                var errors = string.Join("\n",
                    emitResult.Diagnostics
                        .Where(d => d.Severity == DiagnosticSeverity.Error)
                        .Select(d => d.ToString()));
                return "COMPILATION_ERRORS\n" + errors;
            }

            ms.Position = 0;
            var assembly = Assembly.Load(ms.ToArray());

            var entryPoint = assembly.EntryPoint;
            if (entryPoint == null)
            {
                return "RUNTIME_ERROR\nNo entry point found. Ensure your code has a Main method.";
            }

            var task = (Task)entryPoint.Invoke(null, new object[] { Array.Empty<string>() })!;
            if (task != null)
            {
                if (timeoutMs > 0)
                {
                    if (!task.Wait(timeoutMs))
                    {
                        return "RUNTIME_ERROR\nExecution timed out.";
                    }
                }
                else
                {
                    task.GetAwaiter().GetResult();
                }
            }

            var stdout = stdoutWriter.ToString();
            var stderr = stderrWriter.ToString();
            return "SUCCESS\n" + stdout + (stderr.Length > 0 ? "\n" + stderr : "");
        }
        catch (Exception ex)
        {
            var stdout = stdoutWriter.ToString();
            var stderr = stderrWriter.ToString();
            return "RUNTIME_ERROR\n" + stdout + "\n" + ex.ToString() + (stderr.Length > 0 ? "\n" + stderr : "");
        }
        finally
        {
            Console.SetOut(originalOut);
            Console.SetError(originalError);
        }
    }
}

public class Program
{
    public static void Main()
    {
        CSharpBridge.Initialize();
    }
}