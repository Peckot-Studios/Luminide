#include <iostream>
#include <string>
#include <windows.h>
#include <conio.h>
#include <shellapi.h>

using namespace std;

int main()
{
    SetConsoleOutputCP(CP_UTF8);
    cout << "检测依赖文件中……" << endl;

    if (GetFileAttributesA("node_modules") == INVALID_FILE_ATTRIBUTES)
    {
        cout << "运行失败！未检测到依赖文件！" << endl;
        cout << endl;
        cout << "是否已安装 Node.js？" << endl;
        cout << "1.我已安装 Node.js，立即下载依赖" << endl;
        cout << "2.我还未安装 Node.js，立即跳转下载" << endl;
        cout << "输入数字进行选择：";

        char c = _getch();
        int choice = c - '0';

        if (choice == 2)
        {
            cout << "正在为您打开下载页面……" << endl;
            ShellExecuteA(NULL, "open", "https://nodejs.org/zh-cn", NULL, NULL, SW_SHOWNORMAL);
            cout << "请安装完成后再次运行本程序！" << endl;
            exit(0);
        }
        else if (choice != 1)
        {
            exit(1);
        }

        cout << "正在安装依赖……" << endl;
        system("npm i");
        cout << "依赖安装完成！" << endl;
    }
    else
    {
        cout << "检测到依赖文件！" << endl;
    }

    cout << "开始启动 Luminide…" << endl;
    system("node App.js");

    cout << "按任意键继续……";
    cin.ignore();
    _getch();

    return 0;
}
