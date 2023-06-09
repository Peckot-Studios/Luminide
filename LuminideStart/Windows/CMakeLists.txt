project(LuminideStart)
add_executable(LuminideStart main.cpp)

set_target_properties(LuminideStart PROPERTIES
    WIN32_EXECUTABLE TRUE
    RESOURCE "${CMAKE_CURRENT_SOURCE_DIR}/icon.ico"
)