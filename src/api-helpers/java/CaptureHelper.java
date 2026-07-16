public class CaptureHelper {
  public static String runAndCapture(String mainClassName, String input) throws Exception {
    java.io.ByteArrayOutputStream baosOut = new java.io.ByteArrayOutputStream();
    java.io.ByteArrayOutputStream baosErr = new java.io.ByteArrayOutputStream();
    java.io.PrintStream customOut = new java.io.PrintStream(baosOut);
    java.io.PrintStream customErr = new java.io.PrintStream(baosErr);
    java.io.PrintStream originalOut = System.out;
    java.io.PrintStream originalErr = System.err;
    java.io.InputStream originalIn = System.in;

    System.setOut(customOut);
    System.setErr(customErr);
    if (input != null && !input.isEmpty()) {
      System.setIn(new java.io.ByteArrayInputStream(input.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    }

    long startTime = System.nanoTime();
    try {
      Class<?> cls = Class.forName(mainClassName);
      cls.getMethod("main", String[].class).invoke(null, new Object[] { new String[0] });
    } catch (java.lang.reflect.InvocationTargetException ite) {
      Throwable cause = ite.getCause();
      String msg = (cause != null) ? (cause.toString() + "\n" + getStackTraceStr(cause)) : ite.toString();
      System.err.print(msg);
    } catch (Exception e) {
      System.err.print(e.toString() + "\n" + getStackTraceStr(e));
    } finally {
      System.setOut(originalOut);
      System.setErr(originalErr);
      System.setIn(originalIn);
    }
    long elapsedMs = (System.nanoTime() - startTime) / 1_000_000;

    String out = baosOut.toString(java.nio.charset.StandardCharsets.UTF_8);
    String err = baosErr.toString(java.nio.charset.StandardCharsets.UTF_8);
    StringBuilder sb = new StringBuilder();
    sb.append(out);
    if (!err.isEmpty()) {
      if (sb.length() > 0 && sb.charAt(sb.length() - 1) != '\n') sb.append("\n");
      sb.append(err);
    }
    sb.append("\n\n=== Program finished in ").append(elapsedMs).append("ms ===");
    return sb.toString();
  }

  private static String getStackTraceStr(Throwable t) {
    java.io.StringWriter sw = new java.io.StringWriter();
    java.io.PrintWriter pw = new java.io.PrintWriter(sw);
    t.printStackTrace(pw);
    pw.flush();
    return sw.toString();
  }
}
