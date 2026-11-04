FROM eclipse-temurin:17-jdk-jammy AS base
WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

FROM base AS dev
COPY src ./src
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "./mvnw spring-boot:run --no-transfer-progress"]

FROM base AS build
COPY src ./src
RUN ./mvnw -B test package

FROM eclipse-temurin:17-jre-jammy AS prod
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system spring \
    && useradd --system --gid spring --create-home --home-dir /home/spring spring \
    && mkdir -p /app/data/certificates \
    && chown -R spring:spring /app /home/spring

COPY --from=build /workspace/target/*.jar /app/app.jar

USER spring:spring
ENV PORT=8080
ENV CERTIFICATES_DIR=/app/data/certificates
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT}"]
